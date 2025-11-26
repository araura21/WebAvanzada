const API = "http://localhost:3000/api/arboles";

// ==============================
// Obtener precios en dashboard
// ==============================
async function cargarPrecios() {
    try {
        const resp = await fetch(`${API}/precios`);
        const json = await resp.json();

        const data = json.data;

        let html =
            `<strong>Paltos:</strong> $${data.paltos.precio}<br>` +
            `<strong>Limones:</strong> $${data.limones.precio}<br>` +
            `<strong>Chirimoyos:</strong> $${data.chirimoyos.precio}<br>`;

        document.getElementById("card-precios").innerHTML = html;

    } catch (err) {
        console.error(err);
        document.getElementById("card-precios").textContent = "Error al cargar";
    }
}

// ==============================
// Calcular total
// ==============================
async function calcular() {
    const paltos = Number(document.getElementById("paltos").value);
    const limones = Number(document.getElementById("limones").value);
    const chirimoyos = Number(document.getElementById("chirimoyos").value);

    try {
        const resp = await fetch(`${API}/calcular`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paltos, limones, chirimoyos })
        });

        const json = await resp.json();
        const data = json.data;

        // ======================
        // ACTUALIZAR CARDS
        // ======================
        document.getElementById("card-total").textContent = data.totalArboles;
        document.getElementById("card-total-pagar").textContent = `$${data.totalPagar.toFixed(2)}`;

        // ======================
        // ACTUALIZAR TABLA
        // ======================
        const tbody = document.getElementById("detalle-body");
        tbody.innerHTML = "";

        const filas = [
            ["Paltos", data.detalle.paltos],
            ["Limones", data.detalle.limones],
            ["Chirimoyos", data.detalle.chirimoyos]
        ];

        filas.forEach(([tipo, info]) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${tipo}</td>
                <td>${info.cantidad}</td>
                <td>$${info.precioUnit}</td>
                <td>${(info.descuentoAplicado * 100)}%</td>
                <td>$${info.subtotalNeto.toFixed(2)}</td>
            `;

            tbody.appendChild(tr);
        });

        document.getElementById("tabla-detalle").hidden = false;

        // ======================
        // JSON COMPLETO
        // ======================
        document.getElementById("resultado").textContent =
            JSON.stringify(data, null, 2);

    } catch (err) {
        console.error(err);
        alert("Error en la conexión con el backend.");
    }
}

// =============================================
// FUNCIÓN PARA DESCARGAR EL JSON GENERADO
// =============================================
function descargarJSON() {
    const contenido = document.getElementById("resultado").textContent;

    try {
        // Validamos que el texto sea JSON válido
        const jsonObj = JSON.parse(contenido);

        const blob = new Blob(
            [JSON.stringify(jsonObj, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "resultado.json";  // nombre del archivo
        link.click();

        URL.revokeObjectURL(url);

    } catch (err) {
        alert("El contenido no es un JSON válido todavía.");
    }
}

// Ejecutar al cargar
cargarPrecios();

