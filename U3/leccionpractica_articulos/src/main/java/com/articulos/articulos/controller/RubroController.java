package com.articulos.articulos.controller;

import com.articulos.articulos.model.Rubro;
import com.articulos.articulos.service.RubroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rubros")

public class RubroController {

    private RubroService rubroService;

    @GetMapping
    public List<Rubro> listar() {
        return rubroService.obtenerTodos();
    }

    @PostMapping
    public Rubro guardar(@RequestBody Rubro rubro) {
        return rubroService.guardar(rubro);
    }
}