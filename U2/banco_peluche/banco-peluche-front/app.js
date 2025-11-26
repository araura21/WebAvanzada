const API_URL = "http://localhost:3000/api/clientes";

//-------------------------
//Calculo de un cliente
//-------------------------
async function calcularCliente(cliente) {
    const saldoAnterior = document.getElementById("saldoAnterior").value;
    const montoCompras = document.getElementById("montoCompras").value;
    const pagoRealizado = document.getElementById("pagoRealizado").value;

    //validacion: campos vacios
    if(!saldoAnterior || !montoCompras || !pagoRealizado){
        alert("Por favor, complete todos los campos.");
        return;
    }

    //axios
    try{
        const res = await axios.post(`${API_URL}/calcular`,{   //metodo
            saldoAnterior,
            montoCompras,
            pagoRealizado
        });
        const r = res.data.data; //primer data: variable de axios; segundo data: datos del backend

        //resultado
        const tabla = document.querySelector("#resultadoTabla tbody");
        //si la tabla no tiene datos

        if(tabla.children.length === 1 && tabla.children[0].children.length ===1){
            tabla.innerHTML = ""; //limpiar la tabla
        }

        //crear fila
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${Number(saldoAnterior).toFixed(2)}</td>
        <td>${Number(montoCompras).toFixed(2)}</td>
        <td>${Number(pagoRealizado).toFixed(2)}</td>

        <td>${r.saldoBase.toFixed(2)}</td>
        <td>${r.pagoMinimoBase.toFixed(2)}</td>
        <td>${r.esMoroso ? "Si" : "No"}</td>
        <td>${r.interes.toFixed(2)}</td>
        <td>${r.multa.toFixed(2)}</td>
        <td>${r.saldoActual.toFixed(2)}</td>
        <td>${r.pagoMinimo.toFixed(2)}</td>
        <td>${r.pagoNoIntereses.toFixed(2)}</td>
        `;

        tabla.appendChild(fila); //agregar fila a la tabla

    }catch(error){
        console.log(error);
        alert("Error al calcular, revisar backend");
    }
}