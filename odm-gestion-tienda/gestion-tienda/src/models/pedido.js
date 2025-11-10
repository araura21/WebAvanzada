import mongoose from "mongoose";

const {Schema, model} = mongoose; 

const pedidoSchema = new Schema(
    {
        cliente: {type: String, required: true},
        fecha: {type:Date, default: Date.now()},
        //referencias
        productoId:{type:Schema.Types.ObjectId, ref: "Producto"},
        cantidad: {type:Number, required: true},
        total: {type: Number, required: true}
        },

        {timestamps: true}

);

export const Pedido = model("Pedido", pedidoSchema);