package com.facturacion.facturacion.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


public class Factura {
    // ========== DATOS FIJOS DEL EMISOR ==========
    public static final String RAZON_SOCIAL_EMISOR = "ESCOBAR CAJAMARCA IVETH MARICELA";
    public static final String NOMBRE_COMERCIAL = "PICANTERIA DON MARCELO";
    public static final String RUC_EMISOR = "0503815623001";
    public static final String DIRECCION_EMISOR = "GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN";
    public static final String SUCURSAL_EMISOR = "GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN";
    public static final String OBLIGADO_CONTABILIDAD = "NO";

    // ========== DATOS DEL CLIENTE ==========
    private String razonSocialCliente;
    private String rucCliente;
    private String direccionCliente;
    private String correoCliente;
    private String telefonoCliente;

    // ========== FECHA DE EMISIÓN ==========
    private LocalDateTime fechaEmision;

    // ========== DETALLES DE LA FACTURA ==========
    private List<DetalleFactura> detalles;

    // ========== FORMA DE PAGO ==========
    // Solo puede ser: "tarjeta debito", "tarjeta credito", "efectivo", "transferencia"
    private String formaPago;
    private double valorTotalPago;

    // ========== TOTALES ==========
    private double subtotalSinIva;
    private double subtotalConIva;
    private double valorIva;
    private double valorDescuento;
    private double valorTotal;

    public Factura() {
        this.detalles = new ArrayList<>();
        this.fechaEmision = LocalDateTime.now();
    }

    public void agregarDetalle(DetalleFactura detalle) {
        this.detalles.add(detalle);
    }

    public String getFechaFormateada() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return fechaEmision.format(formatter);
    }

    // ========== GETTERS Y SETTERS ==========
    public String getRazonSocialCliente() { return razonSocialCliente; }
    public void setRazonSocialCliente(String razonSocialCliente) { this.razonSocialCliente = razonSocialCliente; }
    public String getRucCliente() { return rucCliente; }
    public void setRucCliente(String rucCliente) { this.rucCliente = rucCliente; }
    public String getDireccionCliente() { return direccionCliente; }
    public void setDireccionCliente(String direccionCliente) { this.direccionCliente = direccionCliente; }
    public String getCorreoCliente() { return correoCliente; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }
    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDateTime fechaEmision) { this.fechaEmision = fechaEmision; }
    public List<DetalleFactura> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleFactura> detalles) { this.detalles = detalles; }
    public String getFormaPago() { return formaPago; }
    public void setFormaPago(String formaPago) { this.formaPago = formaPago; }
    public double getValorTotalPago() { return valorTotalPago; }
    public void setValorTotalPago(double valorTotalPago) { this.valorTotalPago = valorTotalPago; }
    public double getSubtotalSinIva() { return subtotalSinIva; }
    public double getSubtotalConIva() { return subtotalConIva; }
    public double getValorIva() { return valorIva; }
    public double getValorDescuento() { return valorDescuento; }
    public double getValorTotal() { return valorTotal; }
    
    // Getters para datos fijos del emisor
    public static String getRazonSocialEmisor() { return RAZON_SOCIAL_EMISOR; }
    public static String getNombreComercial() { return NOMBRE_COMERCIAL; }
    public static String getRucEmisor() { return RUC_EMISOR; }
    public static String getDireccionEmisor() { return DIRECCION_EMISOR; }
    public static String getSucursalEmisor() { return SUCURSAL_EMISOR; }
    public static String getObligadoContabilidad() { return OBLIGADO_CONTABILIDAD; }
}