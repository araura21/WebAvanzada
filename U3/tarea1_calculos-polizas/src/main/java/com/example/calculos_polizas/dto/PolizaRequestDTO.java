package com.example.calculos_polizas.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "DTO de solicitud para crear una póliza")
public class PolizaRequestDTO {
    
    @NotBlank(message = "El nombre es requerido")
    @Schema(description = "Nombre completo del propietario", example = "Juan Pérez", required = true)
    private String nombre;
    
    @Min(value = 18, message = "El propietario debe ser mayor de edad")
    @Max(value = 120, message = "La edad no es válida")
    @Schema(description = "Edad del propietario (mínimo 18)", example = "30", required = true)
    private int edad;
    
    @Min(value = 0, message = "Los accidentes no pueden ser negativos")
    @Max(value = 99, message = "El número de accidentes no puede ser mayor a 99")
    @Schema(description = "Número de accidentes previos (máximo 99)", example = "1", required = true)
    private int accidentes;
    
    @Positive(message = "El valor del auto debe ser mayor a 0")
    @Schema(description = "Valor comercial del automóvil", example = "25000.00", required = true)
    private double valorAuto;
    
    @NotBlank(message = "El modelo es requerido")
    @Pattern(regexp = "^[ABC]$", message = "El modelo debe ser A, B o C")
    @Schema(description = "Modelo del vehículo (A, B o C)", example = "A", required = true)
    private String modelo;

    public PolizaRequestDTO() {
    }

    public PolizaRequestDTO(String nombre, int edad, int accidentes, double valorAuto, String modelo) {
        this.nombre = nombre;
        this.edad = edad;
        this.accidentes = accidentes;
        this.valorAuto = valorAuto;
        this.modelo = modelo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public int getAccidentes() {
        return accidentes;
    }

    public void setAccidentes(int accidentes) {
        this.accidentes = accidentes;
    }

    public double getValorAuto() {
        return valorAuto;
    }

    public void setValorAuto(double valorAuto) {
        this.valorAuto = valorAuto;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }
}
