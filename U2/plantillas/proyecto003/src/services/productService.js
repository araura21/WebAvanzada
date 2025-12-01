const API_URL = "https://dummyjson.com/products";

export async function getProducts(){
    const resp = await fetch(API_URL);

    if(!resp.ok){
        throw new Error("Error al cargar productos");
    }

    const data = await resp.json();
    return data.products;
}