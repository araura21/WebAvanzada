package com.example.back_notas_bdd.controllers;

import com.example.back_notas_bdd.models.Nota;
import com.example.back_notas_bdd.services.NotaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    //obtener todas las notas
    @GetMapping
    public List<Nota> obtenerTodas(){
        return notaService.obtenerNotas();
    }

    //agregar nota al estudiante
    @PostMapping("/estudiante/{idEstudiante}")
    public Nota agregarNota(
            @PathVariable Long idEstudiante,
            @RequestBody Nota nota
    ){
        return notaService.crearNota(idEstudiante, nota);
    }

    //actualizar nota
    @PutMapping("/{id}")
    public Nota actualizarNota(
            @PathVariable Long id,
            @RequestBody Nota nota
    ){
        return notaService.actualizar(id, nota);
    }

    //eliminar
    @DeleteMapping("/{id}")
    public void eliminarNota(@PathVariable Long id){
        notaService.eliminar(id);
    }
}
