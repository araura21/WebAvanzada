package com.example.back_notas_bdd.repository;

import com.example.back_notas_bdd.models.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaRepository extends JpaRepository<Nota,Long> {
}
