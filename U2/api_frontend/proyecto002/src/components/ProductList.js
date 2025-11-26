import { useState } from "react";

function ProductList ({productos, onActualizar, onEliminar}){ //algo viene del app.js (padre)
    const [editando, setEditando] = useState(null);
    const [datosEdicion, setDatosEdicion] = useState({});

    function abrirEditar(producto) {
        console.log("Editando producto con ID:", producto.id);
        setEditando(producto.id);
        setDatosEdicion({
            title: producto.title,
            price: producto.price
        });
    }

    function cerrarEditar() {
        setEditando(null);
        setDatosEdicion({});
    }

    function guardarCambios(id) {
        if(datosEdicion.title.trim() === "" || datosEdicion.price === "") return;
        
        const productoActualizado = {
            title: datosEdicion.title,
            price: Number(datosEdicion.price)
        };
        
        onActualizar(id, productoActualizado);
        cerrarEditar();
    }

    return (
    <div>
        <h1>Listar productos</h1>
        
        {productos.length === 0 && <p>No hay productos</p>} 

        <ul>
            {productos.map((p)=>( //se recorre todo el array de productos, es un array y almacena
                <li key = {p.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ddd" }}>  
                    {/* Debug: mostrar el ID del producto */}
                    <small style={{color: "gray"}}>ID: {p.id}</small>
                    {editando === p.id ? (
                        <div>
                            <input 
                                type="text" 
                                value={datosEdicion.title} 
                                onChange={(e) => setDatosEdicion({...datosEdicion, title: e.target.value})}
                                placeholder="Título"
                            />
                            <input 
                                type="number" 
                                value={datosEdicion.price} 
                                onChange={(e) => setDatosEdicion({...datosEdicion, price: e.target.value})}
                                placeholder="Precio"
                            />
                            <button onClick={() => guardarCambios(p.id)}>Guardar</button>
                            <button onClick={cerrarEditar}>Cancelar</button>
                        </div>
                    ) : (
                        <div>
                            <span>{p.title} - ${p.price}</span>
                            <button onClick={() => abrirEditar(p)} style={{ marginLeft: "10px" }}>Editar</button>
                            <button onClick={() => onEliminar(p.id)} style={{ marginLeft: "5px", color: "red" }}>Eliminar</button>
                        </div>
                    )}
                </li> //clave unica para react
           ))}
        </ul>

    </div>
    );
}

export default ProductList;