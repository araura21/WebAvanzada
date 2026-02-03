package com.articulos.articulos.service;

import com.articulos.articulos.model.Rubro;
import com.articulos.articulos.repository.RubroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RubroService {

    @Autowired
    private RubroRepository rubroRepository;

    public List<Rubro> obtenerTodos() {
        return rubroRepository.findAll();
    }

    public Rubro guardar(Rubro rubro) {
        return rubroRepository.save(rubro);
    }
    
    public Rubro buscarPorId(Long id) {
        return rubroRepository.findById(id).orElse(null);
    }
}