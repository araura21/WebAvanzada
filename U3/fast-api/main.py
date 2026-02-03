from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(
    title="API de Productos",
    version="0.1.0",
    description="Ejemplo inicial con endpoints en FastAPI"
)

# ---------- Modelo de datos ----------
class Producto(BaseModel):
    codigo: int = Field(gt=0, description="Identificador positivo y único")
    descripcion: str = Field(min_length=1, max_length=100)
    precio: float = Field(gt=0, description="Precio mayor que 0")

class ProductoDetalle(BaseModel):
    producto: Producto
    consulta: Optional[str]

   
# --------- "Base de datos" simulada ---------
productos_db: List[Producto] = [
    Producto(codigo=1, descripcion="Teclado", precio=50.0),
    Producto(codigo=2, descripcion="Mouse", precio=30.0),
]


# ---------- Endpoint GET raíz ----------
@app.get("/")
def inicio():
    return {"mensaje": "API de Productos activa"}

@app.get("/productos", response_model=List[Producto], tags=["productos"])
def listar_productos():
    return productos_db

# ---------- Endpoint GET con parámetro ----------
@app.get("/productos/{codigo}", response_model=ProductoDetalle, tags=["productos"])
def leer_producto(codigo: int, consulta: Optional[str] = None):
    for prod in productos_db:
        if prod.codigo == codigo:
            return {"producto": prod, "consulta": consulta}
    raise HTTPException(status_code=404, detail="Producto no encontrado")

# ---------- Endpoint POST ----------
@app.post("/productos", response_model=Producto, status_code=status.HTTP_201_CREATED, tags=["productos"])
def crear_producto(producto: Producto):
    for p in productos_db:
        if p.codigo == producto.codigo:
            raise HTTPException(status_code=409, detail="Ya existe un producto con ese código")
    productos_db.append(producto)
    return producto

# ---------- Endpoint PUT ----------
@app.put("/productos/{codigo}", response_model=Producto, tags=["productos"])
def actualizar_producto(codigo: int, producto_actualizado: Producto):
    for index, prod in enumerate(productos_db):
        if prod.codigo == codigo:
            productos_db[index] = producto_actualizado
            return producto_actualizado
    raise HTTPException(status_code=404, detail="Producto no encontrado")

# ---------- Endpoint DELETE ----------
@app.delete("/productos/{codigo}", status_code=status.HTTP_204_NO_CONTENT, tags=["productos"])
def eliminar_producto(codigo: int):
    for index, prod in enumerate(productos_db):
        if prod.codigo == codigo:
            productos_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Producto no encontrado")

