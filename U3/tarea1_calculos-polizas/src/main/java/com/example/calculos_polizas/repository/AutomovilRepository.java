package com.example.calculos_polizas.repository;

import com.example.calculos_polizas.model.Automovil;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomovilRepository extends JpaRepository<Automovil, Long> {
}