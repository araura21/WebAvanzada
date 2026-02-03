package com.example.calculos_polizas.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con información de la póliza")
public class PolizaDTO {
    
    @Schema(description = "ID de la póliza generada", example = "1")
    private Long id;
    
    @Schema(description = "Nombre del propietario", example = "Juan Pérez")
    private String propietario;
    
    @Schema(description = "Costo total de la póliza", example = "1250.50")
    private double costoTotal;

    public PolizaDTO(String propietario, double costoTotal) {
        this.propietario = propietario;
        this.costoTotal = costoTotal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropietario() {
        return propietario;
    }

    public void setPropietario(String propietario) {
        this.propietario = propietario;
    }

    public double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(double costoTotal) {
        this.costoTotal = costoTotal;
    }
}