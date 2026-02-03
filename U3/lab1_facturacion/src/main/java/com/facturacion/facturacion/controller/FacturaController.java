import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
    /**
     * Endpoint para descargar la factura generada como PDF
     */
    @GetMapping("/factura/pdf")
    public void descargarFacturaPdf(@SessionAttribute("factura") Factura factura, HttpServletResponse response) throws IOException, DocumentException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=factura.pdf");
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();
        document.add(new Paragraph("FACTURA"));
        document.add(new Paragraph("Emisor: " + Factura.RAZON_SOCIAL_EMISOR));
        document.add(new Paragraph("RUC: " + Factura.RUC_EMISOR));
        document.add(new Paragraph("Cliente: " + factura.getRazonSocialCliente()));
        document.add(new Paragraph("RUC/CI: " + factura.getRucCliente()));
        document.add(new Paragraph("Dirección: " + factura.getDireccionCliente()));
        document.add(new Paragraph("Correo: " + factura.getCorreoCliente()));
        document.add(new Paragraph("Teléfono: " + factura.getTelefonoCliente()));
        document.add(new Paragraph("Forma de Pago: " + factura.getFormaPago()));
        document.add(new Paragraph(" "));
        PdfPTable table = new PdfPTable(5);
        table.addCell("Código");
        table.addCell("Descripción");
        table.addCell("Cantidad");
        table.addCell("Precio U.");
        table.addCell("Total");
        for (var d : factura.getDetalles()) {
            table.addCell(d.getCodigo());
            table.addCell(d.getDescripcion());
            table.addCell(String.valueOf(d.getCantidad()));
            table.addCell(String.valueOf(d.getPrecioUnitario()));
            table.addCell(String.valueOf(d.getCantidad() * d.getPrecioUnitario()));
        }
        document.add(table);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Subtotal sin IVA: " + factura.getSubtotalSinIva()));
        document.add(new Paragraph("Subtotal con IVA: " + factura.getSubtotalConIva()));
        document.add(new Paragraph("Valor IVA: " + factura.getValorIva()));
        document.add(new Paragraph("Valor Descuento: " + factura.getValorDescuento()));
        document.add(new Paragraph("Valor Total: " + factura.getValorTotal()));
        document.close();
    }
package com.facturacion.facturacion.controller;

import com.facturacion.facturacion.model.DetalleFactura;
import com.facturacion.facturacion.model.Factura;
import com.facturacion.facturacion.service.FacturaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
public class FacturaController {

    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    /**
     * Ruta raíz
     */
    @GetMapping("/")
    public String inicio() {
        return "redirect:/factura/nueva";
    }

    /**
     * Muestra el formulario para crear una nueva factura
     * GET /factura/nueva
     */
    @GetMapping("/factura/nueva")
    public String mostrarFormulario(Model model) {
        Factura factura = facturaService.crearFacturaVacia();
        // Asegurar al menos un detalle vacío para el formulario
        if (factura.getDetalles() == null || factura.getDetalles().isEmpty()) {
            factura.getDetalles().add(new DetalleFactura());
        }
        model.addAttribute("factura", factura);
        return "formulario-factura";
    }

    /**
     * Procesa el formulario
     * POST /factura/procesar
     */
    @PostMapping("/factura/procesar")
    public String procesarFactura(
            @ModelAttribute Factura factura,
            RedirectAttributes redirectAttributes,
            Model model) {
        // Filtrar detalles válidos
        List<DetalleFactura> detallesValidos = new ArrayList<>();
        if (factura.getDetalles() != null) {
            for (DetalleFactura detalle : factura.getDetalles()) {
                if (detalle.getDescripcion() != null &&
                        !detalle.getDescripcion().trim().isEmpty() &&
                        detalle.getCantidad() > 0 &&
                        detalle.getPrecioUnitario() > 0) {
                    detallesValidos.add(detalle);
                }
            }
        }
        factura.setDetalles(detallesValidos);

        // Validación de datos de cliente y productos
        if (!facturaService.validarDatosCliente(factura) || detallesValidos.isEmpty()) {
            model.addAttribute("error", "Debe ingresar datos válidos de cliente y al menos un producto válido.");
            model.addAttribute("factura", factura);
            return "formulario-factura";
        }

        // Calcular totales y preparar factura final
        facturaService.calcularTotalesFactura(factura);
        redirectAttributes.addFlashAttribute("factura", factura);
        return "redirect:/factura/generada";
    }

    /**
     * Muestra la factura generada (SOLO LECTURA)
     * GET /factura/generada
     */
    @GetMapping("/factura/generada")
    public String verFacturaGenerada(Model model, @ModelAttribute("factura") Factura factura) {
        if (factura == null || factura.getDetalles() == null || factura.getDetalles().isEmpty()) {
            model.addAttribute("warning", "No se puede mostrar la factura generada porque no hay datos válidos. Por favor, genere una factura primero.");
            return "factura-generada";
        }
        model.addAttribute("factura", factura);
        // Aquí la vista debe ser solo lectura y mostrar los botones para PDF y nueva factura
        return "factura-generada";
    }
}
