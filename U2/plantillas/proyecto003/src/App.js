import { useFetch } from './hook/useFetch';
import { getProducts } from "./services/productService";
import ProductList from "./components/products/ProductList";
import Loading from "./components/products/Loading";
import "./styles/app.css"


function App() {
  const {data: productos, loading, error} = useFetch(getProducts);

  //renderizacion: visualizacion dentro de un return
  return(
    <div className='container'>
      <h1>Tienda virtual de productos</h1>
      <p>Bienvenido a la tiendita...</p>
      {loading && <Loading/>}
      {error && <p className='error'>{error}</p>}
      {!loading && !error && <ProductList productos = {productos}/>}
    </div>
  );
}

export default App;
