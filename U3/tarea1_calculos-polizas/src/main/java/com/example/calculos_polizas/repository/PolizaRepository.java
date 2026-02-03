package com.example.calculos_polizas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.calculos_polizas.model.Poliza;
import java.util.List;

public interface PolizaRepository extends JpaRepository<Poliza, Long> {
    List<Poliza> findByPropietarioNombreContainingIgnoreCase(String nombre);
    List<Poliza> findByEstado(String estado);
}
