const API_URL = "https://ghibliapi.vercel.app/films";

export async function getPeliculas(){
    const resp = await fetch(API_URL);

    if(!resp.ok){
        throw new Error("Error al cargar películas");
    }

    const data = await resp.json();
    return data;
}