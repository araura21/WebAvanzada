package com.example.back_notas_bdd.models;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "estudiantes")
public class Estudiante {
    //es campo ID, va a definirse como clave primaria de la Tabla
    @Id

    //permite que el id se genere de una forma automatica
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //definir los atributos
    private String nombre;
    private String apellido;
    private String email;

    //permite guardar fechas
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;

    //relacion
    @OneToMany(mappedBy = "estudiante", cascade=CascadeType.ALL)
    private List<Nota> notas;
    public Estudiante() {
    }

    //constructores
    public Estudiante(String nombre, String apellido, String email, Date fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
    }

    //getters & setters
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

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
