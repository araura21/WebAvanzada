
package com.example.calculos_polizas.service;

import com.example.calculos_polizas.model.Poliza;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(26, 26, 46);
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(0, 212, 255);
    private static final DeviceRgb SUCCESS_COLOR = new DeviceRgb(16, 185, 129);

    public byte[] generarPolizaPdf(Poliza poliza) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.setMargins(40, 40, 40, 40);

            PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // === ENCABEZADO ===
            agregarEncabezado(document, fontBold, poliza);

            // === INFORMACIÓN DE LA PÓLIZA ===
            agregarInfoPoliza(document, fontBold, fontNormal, poliza);

            // === DATOS DEL PROPIETARIO ===
            agregarSeccion(document, fontBold, fontNormal, "DATOS DEL PROPIETARIO", new String[][]{
                {"Nombre Completo:", poliza.getPropietario().getNombre()},
                {"Edad:", poliza.getPropietario().getEdad() + " años"},
                {"Historial de Accidentes:", poliza.getPropietario().getAccidentes() + " accidente(s)"}
            });

            // === DATOS DEL VEHÍCULO ===
            String modeloDescripcion = obtenerDescripcionModelo(poliza.getAutomovil().getModelo());
            agregarSeccion(document, fontBold, fontNormal, "DATOS DEL VEHÍCULO", new String[][]{
                {"Modelo:", poliza.getAutomovil().getModelo() + " - " + modeloDescripcion},
                {"Valor Comercial:", String.format("$%,.2f", poliza.getAutomovil().getValor())}
            });

            // === DESGLOSE DE COSTOS ===
            agregarDesgloseCostos(document, fontBold, fontNormal, poliza);

            // === COSTO TOTAL ===
            agregarCostoTotal(document, fontBold, poliza);

            // === PIE DE PÁGINA ===
            agregarPiePagina(document, fontNormal);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage(), e);
        }
    }

    private void agregarEncabezado(Document document, PdfFont fontBold, Poliza poliza) {
        // Título principal
        Paragraph titulo = new Paragraph("PÓLIZA DE SEGURO VEHICULAR")
                .setFont(fontBold)
                .setFontSize(24)
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(titulo);

        // Subtítulo
        Paragraph subtitulo = new Paragraph("Compañía de Seguros - Sistema de Gestión de Pólizas")
                .setFontSize(12)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subtitulo);

        // Línea decorativa
        Table lineaDecorativa = new Table(1).useAllAvailableWidth();
        Cell celdaLinea = new Cell()
                .setBackgroundColor(ACCENT_COLOR)
                .setHeight(3)
                .setBorder(Border.NO_BORDER);
        lineaDecorativa.addCell(celdaLinea);
        document.add(lineaDecorativa);
        document.add(new Paragraph("\n"));
    }

    private void agregarInfoPoliza(Document document, PdfFont fontBold, PdfFont fontNormal, Poliza poliza) {
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
        tabla.setMarginBottom(20);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        // Número de póliza
        Cell celdaNumero = new Cell()
                .add(new Paragraph("N° de Póliza").setFont(fontNormal).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph("POL-" + String.format("%06d", poliza.getId())).setFont(fontBold).setFontSize(14).setFontColor(PRIMARY_COLOR))
                .setBorder(Border.NO_BORDER)
                .setPadding(10);
        tabla.addCell(celdaNumero);

        // Fecha de emisión
        Cell celdaFecha = new Cell()
                .add(new Paragraph("Fecha de Emisión").setFont(fontNormal).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph(poliza.getFechaCreacion().format(formatter)).setFont(fontBold).setFontSize(12).setFontColor(PRIMARY_COLOR))
                .setBorder(Border.NO_BORDER)
                .setPadding(10)
                .setTextAlignment(TextAlignment.RIGHT);
        tabla.addCell(celdaFecha);

        // Estado
        Cell celdaEstadoLabel = new Cell()
                .add(new Paragraph("Estado").setFont(fontNormal).setFontSize(10).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph(poliza.getEstado()).setFont(fontBold).setFontSize(12).setFontColor(SUCCESS_COLOR))
                .setBorder(Border.NO_BORDER)
                .setPadding(10);
        tabla.addCell(celdaEstadoLabel);

        tabla.addCell(new Cell().setBorder(Border.NO_BORDER));

        document.add(tabla);
    }

    private void agregarSeccion(Document document, PdfFont fontBold, PdfFont fontNormal, String titulo, String[][] datos) {
        // Título de sección
        Paragraph tituloSeccion = new Paragraph(titulo)
                .setFont(fontBold)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR)
                .setMarginTop(15)
                .setMarginBottom(10);
        document.add(tituloSeccion);

        // Tabla de datos
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{1, 2})).useAllAvailableWidth();
        tabla.setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 1));

        for (String[] fila : datos) {
            Cell celdaLabel = new Cell()
                    .add(new Paragraph(fila[0]).setFont(fontBold).setFontSize(11))
                    .setBackgroundColor(new DeviceRgb(245, 245, 245))
                    .setPadding(10)
                    .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
            tabla.addCell(celdaLabel);

            Cell celdaValor = new Cell()
                    .add(new Paragraph(fila[1]).setFont(fontNormal).setFontSize(11))
                    .setPadding(10)
                    .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
            tabla.addCell(celdaValor);
        }

        document.add(tabla);
    }

    private void agregarDesgloseCostos(Document document, PdfFont fontBold, PdfFont fontNormal, Poliza poliza) {
        Paragraph tituloSeccion = new Paragraph("DESGLOSE DE COSTOS")
                .setFont(fontBold)
                .setFontSize(14)
                .setFontColor(PRIMARY_COLOR)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(tituloSeccion);

        // Calcular desglose
        double valorAuto = poliza.getAutomovil().getValor();
        String modelo = poliza.getAutomovil().getModelo();
        int edad = poliza.getPropietario().getEdad();
        int accidentes = poliza.getPropietario().getAccidentes();

        double cargoBase = valorAuto * 0.035;
        double cargoModelo = calcularCargoModelo(valorAuto, modelo);
        double cargoEdad = calcularCargoEdad(edad);
        double cargoAccidentes = calcularCargoAccidentes(accidentes);

        Table tabla = new Table(UnitValue.createPercentArray(new float[]{3, 1})).useAllAvailableWidth();
        tabla.setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 1));

        agregarFilaCosto(tabla, fontNormal, "Cargo base (3.5% del valor del vehículo)", cargoBase, false);
        agregarFilaCosto(tabla, fontNormal, "Cargo por modelo " + modelo, cargoModelo, false);
        agregarFilaCosto(tabla, fontNormal, "Cargo por edad (" + edad + " años)", cargoEdad, false);
        agregarFilaCosto(tabla, fontNormal, "Cargo por accidentes (" + accidentes + ")", cargoAccidentes, false);

        document.add(tabla);
    }

    private void agregarFilaCosto(Table tabla, PdfFont font, String concepto, double monto, boolean esTotal) {
        DeviceRgb bgColor = esTotal ? SUCCESS_COLOR : new DeviceRgb(255, 255, 255);
        DeviceRgb textColor = esTotal ? new DeviceRgb(255, 255, 255) : PRIMARY_COLOR;

        Cell celdaConcepto = new Cell()
                .add(new Paragraph(concepto).setFont(font).setFontSize(11).setFontColor(textColor))
                .setBackgroundColor(bgColor)
                .setPadding(10)
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
        tabla.addCell(celdaConcepto);

        Cell celdaMonto = new Cell()
                .add(new Paragraph(String.format("$%,.2f", monto)).setFont(font).setFontSize(11).setFontColor(textColor))
                .setBackgroundColor(bgColor)
                .setPadding(10)
                .setTextAlignment(TextAlignment.RIGHT)
                .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
        tabla.addCell(celdaMonto);
    }

    private void agregarCostoTotal(Document document, PdfFont fontBold, Poliza poliza) {
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{3, 1})).useAllAvailableWidth();
        tabla.setMarginTop(10);

        Cell celdaLabel = new Cell()
                .add(new Paragraph("COSTO TOTAL DE LA PÓLIZA").setFont(fontBold).setFontSize(14).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(SUCCESS_COLOR)
                .setPadding(15)
                .setBorder(Border.NO_BORDER);
        tabla.addCell(celdaLabel);

        Cell celdaTotal = new Cell()
                .add(new Paragraph(String.format("$%,.2f", poliza.getCostoTotal())).setFont(fontBold).setFontSize(18).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(SUCCESS_COLOR)
                .setPadding(15)
                .setTextAlignment(TextAlignment.RIGHT)
                .setBorder(Border.NO_BORDER);
        tabla.addCell(celdaTotal);

        document.add(tabla);
    }

    private void agregarPiePagina(Document document, PdfFont fontNormal) {
        document.add(new Paragraph("\n\n"));

        Paragraph disclaimer = new Paragraph(
                "Este documento es un comprobante oficial de la póliza de seguro vehicular. " +
                "La cobertura está sujeta a los términos y condiciones establecidos en el contrato. " +
                "Para cualquier consulta, comuníquese con nuestro centro de atención al cliente."
        )
                .setFont(fontNormal)
                .setFontSize(9)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginTop(30);
        document.add(disclaimer);

        // Línea de firma
        document.add(new Paragraph("\n\n"));
        Table tablaFirma = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
        
        Cell firma1 = new Cell()
                .add(new Paragraph("_________________________").setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph("Firma del Asegurado").setFontSize(10).setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER)
                .setPadding(20);
        tablaFirma.addCell(firma1);

        Cell firma2 = new Cell()
                .add(new Paragraph("_________________________").setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph("Firma del Agente").setFontSize(10).setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER)
                .setPadding(20);
        tablaFirma.addCell(firma2);

        document.add(tablaFirma);
    }

    private String obtenerDescripcionModelo(String modelo) {
        return switch (modelo) {
            case "A" -> "Estándar";
            case "B" -> "Intermedio";
            case "C" -> "Premium";
            default -> "No especificado";
        };
    }

    private double calcularCargoModelo(double valorAuto, String modelo) {
        return switch (modelo) {
            case "A" -> valorAuto * 0.011;
            case "B" -> valorAuto * 0.012;
            case "C" -> valorAuto * 0.015 + 300;
            default -> 0;
        };
    }

    private double calcularCargoEdad(int edad) {
        if (edad <= 24) return 360;
        else if (edad <= 53) return 240;
        else return 430;
    }

    private double calcularCargoAccidentes(int accidentes) {
        if (accidentes <= 3) {
            return accidentes * 17;
        } else {
            return (3 * 17) + ((accidentes - 3) * 21);
        }
    }
}
