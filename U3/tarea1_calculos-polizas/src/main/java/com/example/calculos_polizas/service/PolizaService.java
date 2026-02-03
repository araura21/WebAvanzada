package com.example.calculos_polizas.service;

import org.springframework.stereotype.Service;
import com.example.calculos_polizas.model.Propietario;
import com.example.calculos_polizas.model.Automovil;
import com.example.calculos_polizas.model.Poliza;
import com.example.calculos_polizas.repository.PolizaRepository;
import com.example.calculos_polizas.repository.AutomovilRepository;
import com.example.calculos_polizas.dto.PolizaRequestDTO;
import com.example.calculos_polizas.dto.PolizaDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@Service
public class PolizaService {

    private final PolizaRepository polizaRepository;
    private final AutomovilRepository automovilRepository;

    public PolizaService(PolizaRepository polizaRepository, AutomovilRepository automovilRepository) {
        this.polizaRepository = polizaRepository;
        this.automovilRepository = automovilRepository;
    }

    /**
     * Crea y guarda una nueva póliza en la base de datos
     * @param requestDTO datos de la solicitud
     * @return ResponseEntity con la póliza creada o error
     */
    public ResponseEntity<PolizaDTO> crearPoliza(PolizaRequestDTO requestDTO) {
        // Validaciones
        validarDatos(requestDTO);

        // Crear entidades
        Propietario propietario = new Propietario(
            requestDTO.getNombre(), 
            requestDTO.getEdad(), 
            requestDTO.getAccidentes()
        );
        
        Automovil automovil = new Automovil(
            requestDTO.getModelo(), 
            requestDTO.getValorAuto()
        );

        // Calcular costo
        double costoTotal = calculoCosto(propietario, automovil);

        // Crear y guardar póliza
        Poliza poliza = new Poliza(propietario, automovil, costoTotal);
        Poliza polizaGuardada = polizaRepository.save(poliza);

        // Retornar respuesta con estado 201 CREATED
        PolizaDTO response = new PolizaDTO(propietario.getNombre(), costoTotal);
        response.setId(polizaGuardada.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Obtiene todas las pólizas
     * @return ResponseEntity con lista de pólizas
     */
    public ResponseEntity<List<Poliza>> obtenerTodasLasPolizas() {
        List<Poliza> polizas = polizaRepository.findAll();
        if (polizas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(polizas);
    }

    /**
     * Obtiene una póliza por ID
     * @param id identificador de la póliza
     * @return ResponseEntity con la póliza encontrada o error 404
     */
    public ResponseEntity<Poliza> obtenerPolizaPorId(Long id) {
        Optional<Poliza> poliza = polizaRepository.findById(id);
        if (poliza.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Póliza con ID " + id + " no encontrada");
        }
        return ResponseEntity.ok(poliza.get());
    }

    /**
     * Elimina una póliza por ID
     * @param id identificador de la póliza
     * @return ResponseEntity con estado apropiado
     */
    public ResponseEntity<Void> eliminarPoliza(Long id) {
        if (!polizaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, 
                "Póliza con ID " + id + " no encontrada");
        }
        polizaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca pólizas por nombre del propietario
     * @param nombre nombre a buscar
     * @return ResponseEntity con lista de pólizas
     */
    public ResponseEntity<List<Poliza>> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El nombre de búsqueda no puede estar vacío");
        }
        List<Poliza> polizas = polizaRepository.findByPropietarioNombreContainingIgnoreCase(nombre);
        if (polizas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(polizas);
    }

    /**
     * Valida los datos de entrada
     * @param requestDTO datos a validar
     */
    private void validarDatos(PolizaRequestDTO requestDTO) {
        // Validar nombre
        if (requestDTO.getNombre() == null || requestDTO.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El nombre del propietario es requerido");
        }

        // Validar edad
        if (requestDTO.getEdad() < 18) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El propietario debe ser mayor de edad (18 años o más)");
        }

        if (requestDTO.getEdad() > 120) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "La edad ingresada no es válida");
        }

        // Validar accidentes
        if (requestDTO.getAccidentes() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El número de accidentes no puede ser negativo");
        }

        // Validar valor del auto
        if (requestDTO.getValorAuto() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El valor del automóvil debe ser mayor a 0");
        }

        // Validar modelo
        String modelo = requestDTO.getModelo();
        if (modelo == null || (!modelo.equals("A") && !modelo.equals("B") && !modelo.equals("C"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El modelo debe ser A, B o C");
        }
    }

    /**
     * Calcula el costo de la póliza
     * @param p propietario
     * @param a automóvil
     * @return costo total calculado
     */
    public double calculoCosto(Propietario p, Automovil a) {
        // Validar la edad del propietario
        if (p.getEdad() < 18) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "El propietario debe ser mayor de edad");
        }

        double total = 0;

        // Cargo por valor del automóvil (3.5%)
        total += a.getValor() * 0.035;

        // Cargo por modelo
        switch (a.getModelo()) {
            case "A":
                total += a.getValor() * 0.011;
                break;
            case "B":
                total += a.getValor() * 0.012;
                break;
            case "C":
                total += a.getValor() * 0.015;
                total += 300;
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Modelo de vehículo no válido. Debe ser A, B o C");
        }

        // Cargo por edad
        if (p.getEdad() <= 24) {
            total += 360;
        } else if (p.getEdad() <= 53) {
            total += 240;
        } else {
            total += 430;
        }

        // Cargo por accidentes
        if (p.getAccidentes() <= 3) {
            total += p.getAccidentes() * 17;
        } else {
            total += (3 * 17) + ((p.getAccidentes() - 3) * 21);
        }

        return total;
    }
}