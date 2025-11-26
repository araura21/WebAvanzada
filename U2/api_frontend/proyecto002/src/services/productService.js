//src/services/productServices.js
//servicio, traer la api
const BASE_URL = "https://dummyjson.com/products"

//get
export async function obtenerProductos(){
	const resp = await fetch(BASE_URL);
	const data = await resp.json();
	return data.products;
}

//post
export async function crearProductos(producto){
	const resp = await fetch(`${BASE_URL}/add`, {
		method: "POST",
		headers: {"content-type": "application/json"},
		body: JSON.stringify(producto)
	});
	
	return await resp.json();
}

//update
export async function actualizarProductos(id, producto){
	const resp = await fetch(`${BASE_URL}/${id}`, {
		method: "PUT",
		headers: {"content-type": "application/json"},
		body: JSON.stringify(producto)
	});
	
	return await resp.json();
}


//delete
export async function eliminarProductos(id){
	const resp = await fetch(`${BASE_URL}/${id}`, {
		method: "DELETE",
		headers: {"content-type": "application/json"}
	});
	
	return await resp.json();
}
