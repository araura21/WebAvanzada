import { useFetch } from './hook/useFetch';
import { getPeliculas } from "./services/FilmService";
import FilmList from "./components/FilmList";
import Loading from "./components/Loading";
import "./styles/app.css"


function App() {
  const {data: peliculas, loading, error} = useFetch(getPeliculas);

  //renderizacion: visualizacion dentro de un return
  return(
    <div className='container'>
      <h1>Películas de Studio Ghibli</h1>
      <p>Bienvenido a la galería de películas del Studio Ghibli...</p>
      {loading && <Loading/>}
      {error && <p className='error'>{error}</p>}
      {!loading && !error && <FilmList peliculas = {peliculas}/>}
    </div>
  );
}

export default App;
