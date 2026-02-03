const URL_RUBROS = 'http://localhost:9090/rubros';
const URL_ARTICULOS = 'http://localhost:9090/articulos';

document.addEventListener("DOMContentLoaded", () => {
    cargarRubrosEnSelect();
    cargarArticulosEnTabla();

    // Listener para crear Rubro
    document.getElementById('formRubro').addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearRubro();
    });

    // Listener para crear Artículo
    document.getElementById('formArticulo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await crearArticulo();
    });
});

// --- FUNCIONES LOGICAS ---

async function crearRubro() {
    const nombre = document.getElementById('nombreRubro').value;
    
    await fetch(URL_RUBROS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre })
    });

    // Limpiar y actualizar
    document.getElementById('nombreRubro').value = '';
    cargarRubrosEnSelect(); // Actualizar el select para que aparezca el nuevo rubro
    alert("Rubro creado!");
}

async function crearArticulo() {
    const nombre = document.getElementById('nombreArticulo').value;
    const precio = document.getElementById('precioArticulo').value;
    const rubroId = document.getElementById('rubroSelect').value;

    if (!rubroId) {
        alert("¡Debes seleccionar un Rubro!");
        return;
    }

    // Estructura JSON que espera el backend: { ..., "rubro": { "id": X } }
    const articuloData = {
        nombre: nombre,
        precio: parseFloat(precio),
        rubro: {
            id: rubroId
        }
    };

    await fetch(URL_ARTICULOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articuloData)
    });

    // Limpiar y actualizar tabla
    document.getElementById('nombreArticulo').value = '';
    document.getElementById('precioArticulo').value = '';
    cargarArticulosEnTabla();
    alert("Artículo guardado!");
}

async function cargarRubrosEnSelect() {
    const response = await fetch(URL_RUBROS);
    const rubros = await response.json();
    
    const select = document.getElementById('rubroSelect');
    select.innerHTML = '<option value="" disabled selected>Seleccione un rubro...</option>';

    rubros.forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro.id;
        option.textContent = rubro.nombre;
        select.appendChild(option);
    });
}

async function cargarArticulosEnTabla() {
    const response = await fetch(URL_ARTICULOS);
    const articulos = await response.json();
    
    const tablaBody = document.getElementById('tabla-articulos');
    tablaBody.innerHTML = '';

    articulos.forEach(art => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${art.id}</td>
            <td>${art.nombre}</td>
            <td>$${art.precio.toFixed(2)}</td>
            <td style="color: #2980b9; font-weight: bold;">
                ${art.rubro ? art.rubro.nombre : 'Sin Rubro'}
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}