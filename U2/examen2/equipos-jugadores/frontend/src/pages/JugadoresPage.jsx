import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JugadorForm from "../components/JugadorForm";
import JugadorTable from "../components/JugadorTable";
import { getJugadoresByEquipo } from "../services/jugadorService";
import { Button } from "primereact/button";
import "./Pages.css";

const JugadoresPage = () => {
  const { equipoId } = useParams();
  const navigate = useNavigate();
  const [jugadores, setJugadores] = useState([]);
  const [jugadorAEditar, setJugadorAEditar] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarJugadores = async () => {
    try {
      setCargando(true);
      const res = await getJugadoresByEquipo(equipoId);
      setJugadores(res.data);
    } catch (error) {
      console.error("Error al cargar jugadores:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarJugadores();
  }, [equipoId]);

  const handleEditar = (jugador) => {
    setJugadorAEditar(jugador);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelarEdicion = () => {
    setJugadorAEditar(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-top">
          <Button
            icon="pi pi-arrow-left"
            label="Volver a Equipos"
            severity="secondary"
            onClick={() => navigate("/")}
            className="back-button"
          />
        </div>
        <h1>Gestión de Jugadores</h1>
        <p className="subtitle">Equipo #{equipoId}</p>
      </div>

      <div className="page-content">
        <JugadorForm
          equipoId={parseInt(equipoId)}
          jugadorAEditar={jugadorAEditar}
          onSuccess={cargarJugadores}
          onCancel={handleCancelarEdicion}
        />

        <div className="section">
          <h2>Lista de Jugadores</h2>
          {cargando ? (
            <div className="loading">Cargando jugadores...</div>
          ) : jugadores.length === 0 ? (
            <div className="empty-state">
              <p>No hay jugadores registrados en este equipo.</p>
            </div>
          ) : (
            <JugadorTable
              jugadores={jugadores}
              onSuccess={cargarJugadores}
              onEditar={handleEditar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JugadoresPage;
