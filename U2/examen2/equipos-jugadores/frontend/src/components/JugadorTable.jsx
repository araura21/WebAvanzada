import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { deleteJugador } from "../services/jugadorService";
import "./Table.css";

const JugadorTable = ({ jugadores, onSuccess, onEditar }) => {
  const eliminar = async (id) => {
    if (window.confirm("¿Desea eliminar este jugador?")) {
      try {
        await deleteJugador(id);
        onSuccess();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const editarJugador = (jugador) => {
    if (onEditar) onEditar(jugador);
  };

  const acciones = (row) => (
    <div className="actions-cell">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="warning"
        onClick={() => editarJugador(row)}
        tooltip="Editar"
        tooltipPosition="top"
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => eliminar(row.id)}
        tooltip="Eliminar"
        tooltipPosition="top"
      />
    </div>
  );

  return (
    <div className="table-container">
      <DataTable value={jugadores} stripedRows responsive className="custom-datatable">
        <Column field="id" header="ID" style={{ width: "10%" }} />
        <Column field="cedula" header="Cédula" style={{ width: "20%" }} />
        <Column field="nombre" header="Nombre" style={{ width: "40%" }} />
        <Column
          header="Acciones"
          style={{ width: "30%" }}
          body={acciones}
          className="actions-column"
        />
      </DataTable>
    </div>
  );
};

export default JugadorTable;
