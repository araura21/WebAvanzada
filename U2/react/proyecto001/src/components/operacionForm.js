//Manejo de eventos

import { useState } from "react";

function OperacionForm(props){
    //valores ingresados por el usuario
    const [valor1, setValor1] = useState(""); //valor1: guarda la variable, setValor1: actualiza el estado
    const [valor2, setValor2] = useState("");

    function manejoSuma(){
        props.onSumar(Number(valor1), Number(valor2));
    }

    function manejoResta(){
        props.onRestar(Number(valor1), Number(valor2));
    }
    function manejoMultiplicacion(){
        props.onMultiplicar(Number(valor1), Number(valor2));
    }
    function manejoDivision(){
        props.onDividir(Number(valor1), Number(valor2));
    }

    return(
        <div>
            <h2>Calculadora</h2>
            <p>
                Valor 1: 
                <input type="number" value={valor1} onChange={function(e){setValor1(e.target.value)}}></input>
            </p>
            <p>
                Valor 2: 
                <input type="number" value={valor2} onChange={function(e){setValor2(e.target.value)}}></input>
            </p>
            <button onClick={manejoSuma}>Suma</button>
            <button onClick={manejoResta}>Resta</button>
            <button onClick={manejoMultiplicacion}>Multiplicacion</button>
            <button onClick={manejoDivision}>Division</button>
        </div>
    );
}

export default OperacionForm;