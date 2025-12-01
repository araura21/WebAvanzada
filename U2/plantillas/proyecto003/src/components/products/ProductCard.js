
function ProductCard({producto}){
    return (
        <div className="card">
            <img src={producto.thumbnail} alt={producto.title}></img>
            <h2>{producto.title}</h2>
            <p>Precio: ${producto.price}</p>
        </div>
    )
}

export default ProductCard;