package com.example.back_notas_bdd.controllers;


import com.example.back_notas_bdd.models.Estudiante;
import com.example.back_notas_bdd.services.EstudianteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {
    private final EstudianteService estudianteService;


    public EstudianteController(EstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    //obtener todos
    @GetMapping
    public List<Estudiante> obtenerTodos(){
        return estudianteService.obtenerTodos();

    }

    //crear estudiante
    @PostMapping
    public Estudiante agregarEstudiante (@RequestBody Estudiante estudiante){
        return estudianteService.guardar(estudiante);

    }

    //actualizar
    @PutMapping("{id}")
    public Estudiante actualizarEstudiante (@PathVariable Long id, @RequestBody Estudiante estudiante){
        return estudianteService.actualizar(id, estudiante);

    }

    //eliminar
    @DeleteMapping("/{id}")
    public void eliminarEstudiante(@PathVariable Long id){
        estudianteService.eliminar(id);

    }
}
