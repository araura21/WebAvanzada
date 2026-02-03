package com.example.back_notas_bdd.services;


import com.example.back_notas_bdd.models.Estudiante;
import com.example.back_notas_bdd.models.Nota;
import com.example.back_notas_bdd.repository.EstudianteRepository;
import com.example.back_notas_bdd.repository.NotaRepository;
import org.springframework.stereotype.Service;
import org.w3c.dom.ranges.RangeException;

import java.util.List;

@Service
public class NotaService {
    private  final NotaRepository notaRepository;
    private final EstudianteRepository estudianteRepository;


    public NotaService(NotaRepository notaRepository, EstudianteRepository estudianteRepository) {
        this.notaRepository = notaRepository;
        this.estudianteRepository = estudianteRepository;
    }

    //crear la nota y asociarla a un estudiante
    public Nota crearNota(Long idEstudiante, Nota nota){
        Estudiante estudiante = estudianteRepository.findById(idEstudiante)
                .orElseThrow(() ->
                        new RuntimeException("Estudiante no encontrado por id: " +idEstudiante));
        //validar las 3 notas
        validarNota(nota.getNota1(), "Nota 1");
        validarNota(nota.getNota2(), "Nota 2");
        validarNota(nota.getNota3(), "Nota 3");

        nota.setEstudiante(estudiante);
        double promedio = nota.getPromedio();
        nota.setCalificacion(obtenerEqu(promedio));
        return notaRepository.save(nota);
    }

    //método auxiliar para validar cada nota
    private void validarNota(double nota, String nombreNota) {
        if (nota < 0 || nota > 10) {
            throw new RuntimeException(nombreNota + " debe estar entre 0 y 10");
        }
    }

    //obtener las notas
    public List<Nota> obtenerNotas(){

        return notaRepository.findAll();
    }

    //regla de negocio - calcula el promedio y devuelve la calificación
    public String obtenerEqu(Double promedio){
        if(promedio >= 0 && promedio < 5){
            return "Suspenso";
        } else if (promedio >= 5 && promedio < 7) {
            return "Bien";
        } else if (promedio >= 7 && promedio < 9) {
            return "Notable";
        } else if (promedio >= 9 && promedio <= 10) {
            return "Sobresaliente";
        } else {
            throw new RuntimeException("Promedio fuera de rango");
        }
    }


    //metodo actualizar
    public Nota actualizar (Long id, Nota notaActualizada){
        Nota notaExistente = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));

        //validacion de las 3 notas
        validarNota(notaActualizada.getNota1(), "Nota 1");
        validarNota(notaActualizada.getNota2(), "Nota 2");
        validarNota(notaActualizada.getNota3(), "Nota 3");

        notaExistente.setAsignatura(notaActualizada.getAsignatura());
        notaExistente.setNota1(notaActualizada.getNota1());
        notaExistente.setNota2(notaActualizada.getNota2());
        notaExistente.setNota3(notaActualizada.getNota3());
        double promedio = notaExistente.getPromedio();
        notaExistente.setCalificacion(obtenerEqu(promedio));
        return notaRepository.save(notaExistente);
    }
    //eliminar
    public void eliminar (Long id) {
        notaRepository.deleteById(id);
    }
}
