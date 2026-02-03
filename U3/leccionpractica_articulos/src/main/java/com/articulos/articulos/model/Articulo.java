package com.articulos.articulos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "articulos")
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double precio;

    // Relación: Muchos Artículos pertenecen a un solo Rubro
    @ManyToOne
    @JoinColumn(name = "id_rubro") 
    private Rubro rubro;

    // Constructores, Getters y Setters
    public Articulo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public Rubro getRubro() { return rubro; }
    public void setRubro(Rubro rubro) { this.rubro = rubro; }
}