package com.example.calculos_polizas.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "propietarios")
public class Propietario{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int edad;
    private int accidentes;

    public Propietario(){

    }

    public Propietario(String nombre, int edad, int accidentes) {
        this.nombre = nombre;
        this.edad = edad;
        this.accidentes = accidentes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}