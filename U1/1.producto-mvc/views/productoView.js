//crear html para listar los productos
export function vistaProductos(productos){

    //cabecera
    let html =  `
    <h1>Lista de Productos</h1>
    <a href="/nuevo">Agregar Producto</a>
       
    `
    //recorre cada producto
    productos.forEach(p => {
        html += `
        <li>
        <a href="/productos/${p.id}">${p.nombre} </a>
        - $${p.precio} ${p.categoria}
              
        </li>`;
    });

    //cierre de lista
    html +=`</ul>`;
    return html;
}

//generar html del detalle del producto
export function vistaProductoIndividual(producto){

    return `
    <h1> Detalle del producto </h1>
    <p><b> ID: </b>${producto.id}</p>
    <p><b> Nombre: </b>${producto.nombre}</p>
    <p><b> Precio: </b>${producto.precio}</p>
    <p><b> Categoria: </b>${producto.categoria}</p>

    <!--formulario para eliminar el producto-->
    <form action="/productos/${producto.id}/eliminar" method="post" onsubmit="return confirm('Desea eliminar')">
    <button type="submit">Borrar</button></form>

    <!--formulario para editar el producto-->
    <form action="/productos/${producto.id}/editar" method="get">
    <button type="submit">Editar</button></form>



    <a href="/productos">Regresar</a>
    `;
}

export function vistaEditarProducto(producto) {
  return `
    <h1>Editar producto</h1>
    <form action="/productos/${producto.id}/editar" method="POST">
      <label>Nombre:</label>
      <input type="text" name="nombre" value="${producto.nombre}" required>
      <label>Precio:</label>
      <input type="number" name="precio" value="${producto.precio}" required>
      <label>Categoria:</label>
      <input type="text" name="categoria" value="${producto.categoria}" required>
      <button type="submit">Guardar cambios</button>
      <a href="/productos">Cancelar</a>
    </form>
  `;
}


