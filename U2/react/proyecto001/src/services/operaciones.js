export function sumar(a,b){
    return a + b;
}

export function restar(a,b){
    return a - b;
}

export function multiplicar(a,b){
    return a * b;
}

export function dividir(a,b){
    if(b===0){
        return "No se puede dividir para cero";
    }
    return a / b;
}