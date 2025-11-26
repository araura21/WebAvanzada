import { useState } from "react";
import OperacionForm from "./components/operacionForm";
import Resultado from "./components/resultado";
import Historial from "./components/historial";

import {sumar, restar, multiplicar, dividir} from "./services/operaciones";


function App() {
  const [resultado, setResultado] = useState("");
  const [historial, setHistorial] = useState([]);
  const [nextId, setNextId] = useState(1);
  function agregarOperacion(nombre, simbolo, v1, v2, resultadoOp){
    const op = { id: nextId, operacion: nombre, simbolo, v1, v2, resultado: resultadoOp };
    setNextId(id => id + 1);
    setHistorial(prev => [op, ...prev]);
  }

  function procesarOperacion(nombre, simbolo, operacionFn, v1, v2, texto){
    const r = operacionFn(v1, v2);
    setResultado(texto + r);
    agregarOperacion(nombre, simbolo, v1, v2, r);
  }

  function procesarSuma(v1, v2){
    procesarOperacion('Suma', '+', sumar, v1, v2, 'La suma es: ');
  }

  function procesarResta(v1, v2){
    procesarOperacion('Resta', '-', restar, v1, v2, 'La resta es: ');
  }

  function procesarMultiplicacion(v1, v2){
    procesarOperacion('Multiplicacion', 'x', multiplicar, v1, v2, 'La multiplicacion es: ');
  }

  function procesarDivision(v1, v2){
    procesarOperacion('Division', '/', dividir, v1, v2, 'La division es: ');
  }

   return(
        <div>
          <h1>Calculadora de operaciones basicas</h1>
          <OperacionForm
            onSumar={procesarSuma}
            onRestar={procesarResta}
            onMultiplicar={procesarMultiplicacion}
            onDividir={procesarDivision}
          />
          <Resultado valor={resultado} />
          <Historial operaciones={historial} />
        </div>
    );

}

export default App;
