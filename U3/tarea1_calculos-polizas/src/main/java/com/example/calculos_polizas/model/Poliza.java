package com.example.calculos_polizas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "polizas")
public class Poliza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "propietario_id", nullable = false)
    private Propietario propietario;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "automovil_id", nullable = false)
    private Automovil automovil;

    @Column(nullable = false)
    private double costoTotal;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private String estado;

    public Poliza() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "ACTIVA";
    }

    public Poliza(Propietario propietario, Automovil automovil, double costoTotal) {
        this.propietario = propietario;
        this.automovil = automovil;
        this.costoTotal = costoTotal;
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "ACTIVA";
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Propietario getPropietario() {
        return propietario;
    }

    public void setPropietario(Propietario propietario) {
        this.propietario = propietario;
    }

    public Automovil getAutomovil() {
        return automovil;
    }

    public void setAutomovil(Automovil automovil) {
        this.automovil = automovil;
    }

    public double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(double costoTotal) {
        this.costoTotal = costoTotal;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
