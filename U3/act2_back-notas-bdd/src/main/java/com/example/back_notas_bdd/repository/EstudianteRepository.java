package com.example.back_notas_bdd.repository;

import com.example.back_notas_bdd.models.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstudianteRepository extends JpaRepository<Estudiante,Long > {
}
