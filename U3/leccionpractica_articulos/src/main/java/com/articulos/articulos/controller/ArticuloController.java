package com.articulos.articulos.controller;

import com.articulos.articulos.model.Articulo;
import com.articulos.articulos.service.ArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/articulos")

public class ArticuloController {


    private ArticuloService articuloService;

    @GetMapping
    public List<Articulo> listar() {
        return articuloService.obtenerTodos();
    }

    @PostMapping
    public Articulo guardar(@RequestBody Articulo articulo) {
        return articuloService.guardar(articulo);
    }

}