import { useState } from "react";

function ProductForm({onCrear}){ //funcion enviadda desde el app.js, es ejecutada cuando se presiona un bton
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    function manejarSubmit(e){
        e.preventDefault(); //evita que se recargue la pagina

        if(title.trim() === "" || price === "") return;

        const nuevoProducto = {
            title,
            price: Number(price)
        };

        // Enviar datos al componente padre y limpiar
        onCrear(nuevoProducto);
        setTitle("");
        setPrice("");
    }

    return (
        <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px" }}>
            <h2>Agregar Producto</h2>
            <form onSubmit={manejarSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Título: </label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Nombre del producto"
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Precio: </label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        placeholder="Precio"
                    />
                </div>
                <button type="submit">Agregar Producto</button>
            </form>
        </div>
    );
}

export default ProductForm;
