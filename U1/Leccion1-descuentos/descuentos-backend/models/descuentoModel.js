import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Descuento extends Model {
    // Método para calcular el descuento según el número escogido
    calcularDescuento() {
        const total = this.totalCompra;
        const numero = this.numeroEscogido;

        let porcentaje;

        // Lógica 
        if (numero < 74) {
            porcentaje = 0.15; // 15%
        } else {
            porcentaje = 0.20; // 20%
        }

        const descuento = total * porcentaje;

        return {
            totalCompra: total,
            numeroEscogido: numero,
            porcentajeDescuento: porcentaje * 100,
            descuentoAplicado: descuento,
        };
    }
}

// DEFINIR MODELO IGUAL QUE EN TU EJEMPLO
Descuento.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        totalCompra: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        numeroEscogido: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Promocion",
        timestamps: true,
    }
);

export default Descuento;
