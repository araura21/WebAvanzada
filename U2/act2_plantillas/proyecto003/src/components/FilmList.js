import FilmCard from "./FilmCard";

function FilmList({peliculas}){ //recibe props de nombre películas
    return (
        <div className="grid">
        {
            peliculas.map((p)=>(
                <FilmCard key={p.id} producto = {p}/>
            ))
        }
        </div>
    );
}

export default FilmList;