import mongoose from "mongoose";
import 'dotenv/config'

export async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conexión a Mongo exitosa");
    }catch(e){
        console.log("No se pudo conectar a Mongo", e.message);
    }
}