
function FilmCard({producto: pelicula}){
    return (
        <div className="card">
            <div className="film-content">
                <h2>{pelicula.title}</h2>
                <p className="original-title"><strong>Título original:</strong> {pelicula.original_title}</p>
                <p><strong>Director:</strong> {pelicula.director}</p>
                <p><strong>Año de lanzamiento:</strong> {pelicula.release_date}</p>
                <p className="description"><strong>Descripción:</strong> {pelicula.description}</p>
            </div>
        </div>
    )
}

export default FilmCard;