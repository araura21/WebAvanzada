import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { deleteEquipo } from "../services/equipoService";
import { useNavigate } from "react-router-dom";
import "./Table.css";

const EquipoTable = ({ equipos, onSuccess, onEditar }) => {
  const navigate = useNavigate();

  const eliminar = async (id) => {
    if (window.confirm("¿Desea eliminar este equipo?")) {
      try {
        await deleteEquipo(id);
        onSuccess();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const editarEquipo = (equipo) => {
    if (onEditar) onEditar(equipo);
  };

  const acciones = (row) => (
    <div className="actions-cell">
      <Button
        icon="pi pi-eye"
        rounded
        text
        severity="info"
        onClick={() => navigate(`/jugadores/${row.id}`)}
        tooltip="Ver jugadores"
        tooltipPosition="top"
      />
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="warning"
        onClick={() => editarEquipo(row)}
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
      <DataTable value={equipos} stripedRows responsive className="custom-datatable">
        <Column field="id" header="ID" style={{ width: "10%" }} />
        <Column field="codigo" header="Código" style={{ width: "20%" }} />
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

export default EquipoTable;
