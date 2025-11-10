import mongoose from "mongoose";

const {Schema, model} = mongoose; 

const productoSchema = new Schema(
    {
        nombre: {type: String, required: true},
        precio: {type:Number, required:true},
        stock: {type:Number, required: true},
        categoria: {type:String, required:true}
    },
    {timestamp:true}
);

export const Producto = model("Producto", productoSchema);