/**
 * Utility functions for form validations
 */

// Valida cédula ecuatoriana (algoritmo módulo 10)
export const validarCedula = (cedula) => {
    if (!cedula) return false;
    if (cedula.length !== 10) return false;

    // Solo dígitos
    if (!/^\d+$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitoVideos = parseInt(cedula.substring(2, 3), 10);
    if (digitoVideos >= 6) return false; // Tercer dígito debe ser < 6 para personas naturales

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let total = 0;

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
        if (valor >= 10) valor -= 9;
        total += valor;
    }

    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    const decenaSuperior = Math.ceil(total / 10) * 10;
    let calculado = decenaSuperior - total;
    if (calculado === 10) calculado = 0;

    return digitoVerificador === calculado;
};

// Evita XSS básico y caracteres peligrosos (<, >, script)
export const validarTexto = (texto) => {
    if (!texto) return true; // Permitir vacíos si no es required
    const regexPeligrosa = /<|>|script|onload|onerror|alert|javascript:/i;
    // Permitir letras, números, espacios, tildes, puntuación básica
    // Pero bloquear explícitamente tags HTML
    return !regexPeligrosa.test(texto);
};

export const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validarPassword = (password) => {
    // Mínimo 6 caracteres
    return password && password.length >= 6;
};

export const validarNumerico = (valor, min, max) => {
    const num = parseFloat(valor);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};
