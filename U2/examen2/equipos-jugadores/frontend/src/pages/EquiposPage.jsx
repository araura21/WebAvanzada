import { useEffect, useState } from "react";
import EquipoForm from "../components/EquipoForm";
import EquipoTable from "../components/EquipoTable";
import { getEquipos } from "../services/equipoService";
import "./Pages.css";

const EquiposPage = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoAEditar, setEquipoAEditar] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarEquipos = async () => {
    try {
      setCargando(true);
      const res = await getEquipos();
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const handleEditar = (equipo) => {
    setEquipoAEditar(equipo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicion = () => {
    setEquipoAEditar(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestión de Equipos</h1>
      </div>

      <div className="page-content">
        <EquipoForm
          equipoAEditar={equipoAEditar}
          onSuccess={cargarEquipos}
          onCancel={handleCancelarEdicion}
        />

        <div className="section">
          <h2>Lista de Equipos</h2>
          {cargando ? (
            <div className="loading">Cargando equipos...</div>
          ) : equipos.length === 0 ? (
            <div className="empty-state">
              <p>No hay equipos registrados.</p>
            </div>
          ) : (
            <EquipoTable
              equipos={equipos}
              onSuccess={cargarEquipos}
              onEditar={handleEditar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EquiposPage;
