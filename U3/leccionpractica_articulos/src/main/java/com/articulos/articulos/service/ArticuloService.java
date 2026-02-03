package com.articulos.articulos.service;

import com.articulos.articulos.model.Articulo;
import com.articulos.articulos.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository articuloRepository;

    public List<Articulo> obtenerTodos() {
        return articuloRepository.findAll();
    }

    public Articulo guardar(Articulo articulo) {
        return articuloRepository.save(articulo);
    }
}