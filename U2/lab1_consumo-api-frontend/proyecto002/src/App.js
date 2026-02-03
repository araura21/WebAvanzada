import { useEffect, useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import {
  obtenerProductos,
  crearProductos,
  actualizarProductos,
  eliminarProductos
} from "./services/productService";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [proximoId, setProximoId] = useState(100); 

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); // [] → solo una vez (como componentDidMount)

  //  Evento que viene del hijo ProductForm
  async function handleCrear(productoNuevo) {
    try {
      const creado = await crearProductos(productoNuevo);

      // Generar un ID único para productos creados 
      const idUnico = proximoId;
      setProximoId(proximoId + 1);
      
      const productoConId = {
        ...creado,
        id: idUnico  // Usar siempre el ID generado localmente
      };

      setProductos([productoConId, ...productos]);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  }

  // Actualizar producto
  async function handleActualizar(id, productoActualizado) {
    try {
      const actualizado = await actualizarProductos(id, productoActualizado);
      
      // Actualizar el producto en la lista
      setProductos(productos.map(p => p.id === id ? actualizado : p));
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  // Eliminar producto
  async function handleEliminar(id) {
    try {
      await eliminarProductos(id);
      
      // Eliminar el producto de la lista
      setProductos(productos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>React + DummyJSON</h1>

      {/* HIJO que genera evento */}
      <ProductForm onCrear={handleCrear} />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList 
          productos={productos} 
          onActualizar={handleActualizar}
          onEliminar={handleEliminar}
        />
      )}
    </div>
  );
}

export default App;