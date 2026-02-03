package com.example.back_notas_bdd.models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="notas")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    //atributos
    private Long id;
    private String asignatura;
    private double nota1;
    private double nota2;
    private double nota3;

    private Date fechaRegistro = new Date();
    private String calificacion;

    //relacion de las tablas
    @ManyToOne
    @JoinColumn(name = "id_estudiante")

    private Estudiante estudiante; //instanciar la clase estudiante

    //constructor vacio y con datos
    public Nota() {
    }

    //constructores
    public Nota(String asignatura, double nota1, double nota2, double nota3) {
        this.asignatura = asignatura;
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.nota3 = nota3;
    }

    public String getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(String calificacion) {
        this.calificacion = calificacion;
    }

    //metodos de acceso

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(String asignatura) {
        this.asignatura = asignatura;
    }

    public double getNota1() {
        return nota1;
    }

    public void setNota1(double nota1) {
        this.nota1 = nota1;
    }

    public double getNota2() {
        return nota2;
    }

    public void setNota2(double nota2) {
        this.nota2 = nota2;
    }

    public double getNota3() {
        return nota3;
    }

    public void setNota3(double nota3) {
        this.nota3 = nota3;
    }

    // Método para calcular el promedio de las 3 notas
    public double getPromedio() {
        return (nota1 + nota2 + nota3) / 3.0;
    }

    public Date getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }
}
