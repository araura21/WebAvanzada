package com.example.back_notas_bdd.services;

import com.example.back_notas_bdd.models.Estudiante;
import com.example.back_notas_bdd.repository.EstudianteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;

    public EstudianteService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    public List<Estudiante> obtenerTodos() {
        return estudianteRepository.findAll();
    }

    public Estudiante guardar(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    public Estudiante buscarPorId(Long id) {
        return estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
    }

    public Estudiante actualizar(Long id, Estudiante estudiante) {
        return estudianteRepository.findById(id)
                .map(estudianteExistente -> {
                    estudianteExistente.setNombre(estudiante.getNombre());
                    estudianteExistente.setApellido(estudiante.getApellido());
                    estudianteExistente.setEmail(estudiante.getEmail());
                    estudianteExistente.setFechaNacimiento(estudiante.getFechaNacimiento());
                    return estudianteRepository.save(estudianteExistente);
                })
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
    }

    public void eliminar(Long id) {
        estudianteRepository.deleteById(id);
    }
}
