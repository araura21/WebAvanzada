import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { createJugador, updateJugador } from "../services/jugadorService";
import "./Form.css";

const JugadorForm = ({ equipoId, jugadorAEditar, onSuccess, onCancel }) => {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (jugadorAEditar) {
      setCedula(jugadorAEditar.cedula);
      setNombre(jugadorAEditar.nombre);
      setEditando(true);
      setError("");
    } else {
      setCedula("");
      setNombre("");
      setEditando(false);
      setError("");
    }
  }, [jugadorAEditar]);

  // Validaciones
  const validarCedula = (valor) => {
    // Solo números, máximo 10 dígitos
    return /^\d{0,10}$/.test(valor);
  };
  const validarNombre = (valor) => {
    // Solo letras y espacios
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/.test(valor);
  };

  const guardar = async () => {
    setError("");

    if (!cedula.trim() || !nombre.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }
    if (!validarCedula(cedula)) {
      setError("La cédula debe contener solo números y máximo 10 dígitos");
      return;
    }
    if (!validarNombre(nombre)) {
      setError("El nombre solo puede contener letras y espacios");
      return;
    }

    setCargando(true);
    try {
      if (editando && jugadorAEditar) {
        await updateJugador(jugadorAEditar.id, {
          cedula,
          nombre,
          equipo_id: equipoId,
        });
      } else {
        await createJugador({
          cedula,
          nombre,
          equipo_id: equipoId,
        });
      }

      setCedula("");
      setNombre("");
      setEditando(false);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el jugador");
    } finally {
      setCargando(false);
    }
  };

  const cancelar = () => {
    setCedula("");
    setNombre("");
    setEditando(false);
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>{editando ? "Editar Jugador" : "Registrar Nuevo Jugador"}</h2>

        {error && <Message severity="error" text={error} className="mb-3" />}

        <div className="form-group">
          <label htmlFor="cedula">Cédula</label>
          <InputText
            id="cedula"
            value={cedula}
            keyfilter="int"
            maxLength={10}
            onChange={(e) => {
              if (validarCedula(e.target.value)) setCedula(e.target.value);
            }}
            placeholder="Ej: 1234567890"
            className="w-full"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombreJugador">Nombre del Jugador</label>
          <InputText
            id="nombreJugador"
            value={nombre}
            onChange={(e) => {
              if (validarNombre(e.target.value)) setNombre(e.target.value);
            }}
            placeholder="Ej: Juan Pérez"
            className="w-full"
          />
        </div>

        <div className="form-buttons">
          <Button
            label={editando ? "Actualizar" : "Guardar"}
            onClick={guardar}
            disabled={cargando}
            loading={cargando}
            className="p-button-primary"
          />
          {editando && (
            <Button
              label="Cancelar"
              severity="secondary"
              onClick={cancelar}
              disabled={cargando}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JugadorForm;
