import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { createEquipo, updateEquipo } from "../services/equipoService";
import "./Form.css";

const EquipoForm = ({ equipoAEditar, onSuccess, onCancel }) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (equipoAEditar) {
      setCodigo(equipoAEditar.codigo);
      setNombre(equipoAEditar.nombre);
      setEditando(true);
      setError("");
    } else {
      setCodigo("");
      setNombre("");
      setEditando(false);
      setError("");
    }
  }, [equipoAEditar]);

  // Validaciones
  const validarCodigo = (valor) => {
    // Letras y números, máximo 5 caracteres
    return /^[A-Za-z0-9]{0,5}$/.test(valor);
  };
  const validarNombre = (valor) => {
    // Solo letras y espacios
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/.test(valor);
  };

  const guardar = async () => {
    setError("");

    if (!codigo.trim() || !nombre.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }
    if (!validarCodigo(codigo)) {
      setError("El código debe contener solo letras y números, máximo 5 caracteres");
      return;
    }
    if (!validarNombre(nombre)) {
      setError("El nombre solo puede contener letras y espacios");
      return;
    }

    setCargando(true);
    try {
      if (editando && equipoAEditar) {
        await updateEquipo(equipoAEditar.id, { codigo, nombre });
      } else {
        await createEquipo({ codigo, nombre });
      }
      setCodigo("");
      setNombre("");
      setEditando(false);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el equipo");
    } finally {
      setCargando(false);
    }
  };

  const cancelar = () => {
    setCodigo("");
    setNombre("");
    setEditando(false);
    setError("");
    if (onCancel) onCancel();
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>{editando ? "Editar Equipo" : "Registrar Nuevo Equipo"}</h2>

        {error && <Message severity="error" text={error} className="mb-3" />}

        <div className="form-group">
          <label htmlFor="codigo">Código del Equipo</label>
          <InputText
            id="codigo"
            value={codigo}
            maxLength={5}
            onChange={(e) => {
              if (validarCodigo(e.target.value)) setCodigo(e.target.value);
            }}
            placeholder="Ej: EQ001"
            className="w-full"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre del Equipo</label>
          <InputText
            id="nombre"
            value={nombre}
            onChange={(e) => {
              if (validarNombre(e.target.value)) setNombre(e.target.value);
            }}
            placeholder="Ej: Los Campeones"
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

export default EquipoForm;
