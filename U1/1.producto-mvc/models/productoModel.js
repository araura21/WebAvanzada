//clase productos
class Producto {
    constructor(id, nombre, precio, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}

//clase para administrar los productos
class ProductoModel {
    static productos=[
    new Producto(1, "Zapatos", 50, "Caballero"),
    new Producto(2, "Camisa", 30, "Dama"),
    new Producto(3, "Pantalones", 40, "Niños"),
    new Producto(4, "Sombrero", 20, "Unisex"),
    ];

    //metodo para obtener todos los productos
    static obtenerTodos() {
        return this.productos;
    }

    //buscar por id
    static obtenerPorId(id) {
        return this.productos.find(p => p.id === id);
    }

    //agregar producto
    static agregarProducto(nombre, precio, categoria) {
        const nuevo = new Producto(
            this.productos.length + 1, //generar id de forma automatica
            nombre,
            precio,
            categoria
        );

        this.productos.push(nuevo);
        return nuevo;  //devolver el producto agregado
    }

    //eliminar por ID
    static eliminarPorId(id){
        const idNumero = parseInt(id);
        const producto = this.productos.find(p => p.id === idNumero);
        if(!producto) return false; //si no lo encuentra no me devuelve nada

        this.productos = this.productos.filter(p => p.id !== idNumero); //si lo encuentra, crea un nuevo arreglo
        return true;                                                    //menos el numero que buscamos
    }

    //editar producto por ID
    static editarProducto(id,nuevoNombre, nuevoPrecio, nuevaCategoria){
        const producto = this.productos.find(p => p.id === id);
        if(producto){
            producto.nombre = nuevoNombre;
            producto.precio = nuevoPrecio;
            producto.categoria = nuevaCategoria;

        };    
    }
}

//Exportar clase para que el controlador pueda usarla
export default ProductoModel;
