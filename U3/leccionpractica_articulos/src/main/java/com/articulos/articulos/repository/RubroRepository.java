package com.articulos.articulos.repository;

import com.articulos.articulos.model.Rubro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RubroRepository extends JpaRepository<Rubro, Long> {
    // Aquí ya tenemos métodos como save(), findAll(), findById(), etc.
}