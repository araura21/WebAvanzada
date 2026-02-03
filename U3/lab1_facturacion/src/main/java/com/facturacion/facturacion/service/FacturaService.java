package com.facturacion.facturacion.service;

import com.facturacion.facturacion.model.DetalleFactura;
import com.facturacion.facturacion.model.Factura;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FacturaService {

    /**
     * Valida los datos del cliente: razón social, RUC/CI, correo y teléfono.
     */
    public boolean validarDatosCliente(Factura factura) {
        if (factura == null) return false;
        if (factura.getRazonSocialCliente() == null || factura.getRazonSocialCliente().trim().isEmpty()) return false;
        if (factura.getRucCliente() == null || factura.getRucCliente().trim().isEmpty()) return false;
        if (!esCedulaORucValido(factura.getRucCliente())) return false;
        if (factura.getCorreoCliente() == null || !esCorreoValido(factura.getCorreoCliente())) return false;
        if (factura.getTelefonoCliente() == null || !esTelefonoValido(factura.getTelefonoCliente())) return false;
        return true;
    }

    /**
     * Valida si la cédula o RUC es válida por longitud y formato básico ecuatoriano.
     */
    public boolean esCedulaORucValido(String identificacion) {
        if (identificacion == null) return false;
        if (identificacion.matches("\\d{10}")) return true; // Cédula
        if (identificacion.matches("\\d{13}")) return true; // RUC
        return false;
    }

    /**
     * Valida el correo electrónico (formato básico)
     */
    public boolean esCorreoValido(String correo) {
        if (correo == null) return false;
        return correo.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    /**
     * Valida el teléfono ecuatoriano (10 dígitos)
     */
    public boolean esTelefonoValido(String telefono) {
        if (telefono == null) return false;
        return telefono.matches("^\\d{10}$");
    }

    /**
     * Realiza todos los cálculos de la factura: subtotal, descuento, IVA, total.
     * Aplica descuento: 5% si hay 4 productos, 10% si hay 8 productos, sino 0.
     * IVA: 15% sobre el subtotal con descuento.
     */
    public void calcularTotalesFactura(Factura factura) {
        int totalProductos = 0;
        double subtotal = 0;
        for (DetalleFactura d : factura.getDetalles()) {
            double totalDetalle = Math.round((d.getCantidad() * d.getPrecioUnitario()) * 100.0) / 100.0;
            subtotal += totalDetalle;
            totalProductos += d.getCantidad();
        }
        double porcentajeDescuento = 0;
        if (totalProductos == 4) {
            porcentajeDescuento = 0.05;
        } else if (totalProductos == 8) {
            porcentajeDescuento = 0.10;
        }
        double valorDescuento = Math.round(subtotal * porcentajeDescuento * 100.0) / 100.0;
        double subtotalSinIva = Math.round((subtotal - valorDescuento) * 100.0) / 100.0;
        double valorIva = Math.round(subtotalSinIva * 0.15 * 100.0) / 100.0;
        double subtotalConIva = subtotalSinIva;
        double valorTotal = Math.round((subtotalSinIva + valorIva) * 100.0) / 100.0;
        factura.setTotales(subtotalSinIva, subtotalConIva, valorIva, valorDescuento, valorTotal);
        factura.setValorTotalPago(valorTotal);
    }

    /**
     * Crea una factura nueva vacía lista para ser llenada
     */
    public Factura crearFacturaVacia() {
        Factura factura = new Factura();
        factura.setFechaEmision(LocalDateTime.now());
        return factura;
    }

    /**
     * Formatea un valor double a String con 2 decimales
     */
    public String formatearValor(double valor) {
        return String.format("%.2f", valor);
    }
}
    
