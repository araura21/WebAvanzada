import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Equipo = sequelize.define(
  "Equipo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "equipos",
    timestamps: false,
  }
);

export default Equipo;
