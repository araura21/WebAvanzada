import ProductCard from "./ProductCard";

function ProductList({productos}){ //recibe props de nombre productos8
    return (
        <div className="grid">
        {
            productos.map((p)=>(
                <ProductCard key={p.id} producto = {p}/>
            ))
        }
        </div>
    );
}

export default ProductList;