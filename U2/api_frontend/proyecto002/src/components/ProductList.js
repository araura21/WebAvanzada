import { useState } from "react";
import "../App.css";
function ProductList({ productos, onActualizar, onEliminar }) { //algo viene del app.js (padre)
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
        if (datosEdicion.title.trim() === "" || datosEdicion.price === "") return;

        const productoActualizado = {
            title: datosEdicion.title,
            price: Number(datosEdicion.price)
        };

        onActualizar(id, productoActualizado);
        cerrarEditar();
    }

    return (
        <div className="product-list-container">
            <h1>Listar productos</h1>

            {productos.length === 0 && <p>No hay productos</p>}

            <ul>
                {productos.map((p) => ( //se recorre todo el array de productos, es un array y almacena
                    <li key={p.id} className="product-item">
                        {/* Debug: mostrar el ID del producto */}
                        <small className="product-id">ID: {p.id}</small>
                        {editando === p.id ? (
                            <div className="edit-mode-container">
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={datosEdicion.title}
                                    onChange={(e) => setDatosEdicion({ ...datosEdicion, title: e.target.value })}
                                    placeholder="Título"
                                />
                                <input
                                    type="number"
                                    className="edit-input"
                                    value={datosEdicion.price}
                                    onChange={(e) => setDatosEdicion({ ...datosEdicion, price: e.target.value })}
                                    placeholder="Precio"
                                />
                                <button className="btn-save" onClick={() => guardarCambios(p.id)}>Guardar</button>
                                <button className="btn-cancel" onClick={cerrarEditar}>Cancelar</button>
                            </div>
                        ) : (
                            <div className="product-content">
                                <span className="product-info">{p.title} - ${p.price}</span>
                                <div className="action-buttons">
                                    <button className="btn-edit" onClick={() => abrirEditar(p)}>Editar</button>
                                    <button className="btn-delete" onClick={() => onEliminar(p.id)}>Eliminar</button>
                                </div>
                            </div>
                        )}
                    </li> //clave unica para react
                ))}
            </ul>

        </div>
    );
}

export default ProductList;