import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Equipo from "./Equipo.js";

const Jugador = sequelize.define(
  "Jugador",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cedula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Equipo,
        key: "id",
      },
    },
  },
  {
    tableName: "jugadores",
    timestamps: false,
  }
);

// Relación: Un equipo tiene muchos jugadores
Equipo.hasMany(Jugador, {
  foreignKey: "equipo_id",
  onDelete: "CASCADE",
});

// Relación: Un jugador pertenece a un equipo
Jugador.belongsTo(Equipo, {
  foreignKey: "equipo_id",
});

export default Jugador;
