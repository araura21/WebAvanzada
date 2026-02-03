package com.example.calculos_polizas.controller;

import com.example.calculos_polizas.dto.PolizaDTO;
import com.example.calculos_polizas.model.Automovil;
import com.example.calculos_polizas.model.Poliza;
import com.example.calculos_polizas.model.Propietario;
import com.example.calculos_polizas.service.PolizaService;
import com.example.calculos_polizas.service.PdfService;
import com.example.calculos_polizas.dto.PolizaRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/polizas")
@Tag(name = "Pólizas", description = "API para gestión de pólizas de seguro vehicular")
public class PolizaController {

    private final PolizaService service;
    private final PdfService pdfService;

    public PolizaController(PolizaService service, PdfService pdfService) {
        this.service = service;
        this.pdfService = pdfService;
    }

    @Operation(summary = "Calcular póliza (GET)", 
               description = "Calcula el costo de una póliza usando parámetros de consulta (no guarda en BD)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cálculo exitoso",
                     content = @Content(schema = @Schema(implementation = PolizaDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @GetMapping
    public PolizaDTO calcular(
            @Parameter(description = "Nombre del propietario", required = true) @RequestParam String nombre,
            @Parameter(description = "Edad del propietario (min 18)", required = true) @RequestParam int edad,
            @Parameter(description = "Número de accidentes previos", required = true) @RequestParam int accidentes,
            @Parameter(description = "Valor del automóvil", required = true) @RequestParam double valorAuto,
            @Parameter(description = "Modelo del vehículo (A, B o C)", required = true) @RequestParam String modelo) {
        
        Propietario propietario = new Propietario(nombre, edad, accidentes);
        Automovil automovil = new Automovil(modelo, valorAuto);

        double costoTotal = service.calculoCosto(propietario, automovil);
        return new PolizaDTO(propietario.getNombre(), costoTotal);
    }

    @Operation(summary = "Crear póliza", 
               description = "Crea una nueva póliza y la guarda en la base de datos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Póliza creada exitosamente",
                     content = @Content(schema = @Schema(implementation = PolizaDTO.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/cliente")
    public ResponseEntity<PolizaDTO> calcularPost(@Valid @RequestBody PolizaRequestDTO requestDTO) {
        return service.crearPoliza(requestDTO);
    }

    @Operation(summary = "Obtener todas las pólizas", 
               description = "Retorna una lista de todas las pólizas registradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de pólizas obtenida"),
        @ApiResponse(responseCode = "204", description = "No hay pólizas registradas")
    })
    @GetMapping("/todas")
    public ResponseEntity<List<Poliza>> obtenerTodas() {
        return service.obtenerTodasLasPolizas();
    }

    @Operation(summary = "Obtener póliza por ID", 
               description = "Busca y retorna una póliza específica por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Póliza encontrada"),
        @ApiResponse(responseCode = "404", description = "Póliza no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Poliza> obtenerPorId(
            @Parameter(description = "ID de la póliza", required = true) @PathVariable Long id) {
        return service.obtenerPolizaPorId(id);
    }

    @Operation(summary = "Eliminar póliza", 
               description = "Elimina una póliza por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Póliza eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Póliza no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID de la póliza a eliminar", required = true) @PathVariable Long id) {
        return service.eliminarPoliza(id);
    }

    @Operation(summary = "Buscar pólizas por nombre", 
               description = "Busca pólizas que coincidan con el nombre del propietario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pólizas encontradas"),
        @ApiResponse(responseCode = "204", description = "No se encontraron pólizas"),
        @ApiResponse(responseCode = "400", description = "Nombre de búsqueda vacío")
    })
    @GetMapping("/buscar")
    public ResponseEntity<List<Poliza>> buscarPorNombre(
            @Parameter(description = "Nombre del propietario a buscar", required = true) 
            @RequestParam String nombre) {
        return service.buscarPorNombre(nombre);
    }

    @Operation(summary = "Descargar póliza en PDF", 
               description = "Genera y descarga la póliza en formato PDF")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "PDF generado exitosamente",
                     content = @Content(mediaType = "application/pdf")),
        @ApiResponse(responseCode = "404", description = "Póliza no encontrada")
    })
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(
            @Parameter(description = "ID de la póliza", required = true) @PathVariable Long id) {
        
        // Obtener la póliza
        ResponseEntity<Poliza> polizaResponse = service.obtenerPolizaPorId(id);
        Poliza poliza = polizaResponse.getBody();
        
        if (poliza == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Póliza no encontrada");
        }

        // Generar PDF
        byte[] pdfBytes = pdfService.generarPolizaPdf(poliza);

        // Configurar headers para descarga
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "poliza_" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}