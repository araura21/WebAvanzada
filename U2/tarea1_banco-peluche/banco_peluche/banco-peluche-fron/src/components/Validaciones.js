const Validaciones = {
    validarCedula: (cedula) => {
        if (!cedula || cedula.length !== 10) return false;

        const digitoRegion = parseInt(cedula.substring(0, 2));
        if (digitoRegion < 1 || digitoRegion > 24) return false;

        const ultimoDigito = parseInt(cedula.substring(9, 10));
        let pares = 0;
        let impares = 0;
        let suma = 0;

        for (let i = 0; i < 9; i++) {
            let digito = parseInt(cedula.substring(i, i + 1));
            if (i % 2 === 0) {
                digito = digito * 2;
                if (digito > 9) digito = digito - 9;
                pares += digito;
            } else {
                impares += digito;
            }
        }

        suma = pares + impares;

        let digitoValidador = 10 - (suma % 10);
        if (digitoValidador === 10) digitoValidador = 0;

        return digitoValidador === ultimoDigito;
    },

    validarTelefono: (telefono) => {
        const regex = /^\d{10}$/;
        return regex.test(telefono);
    },

    validarNoNegativo: (valor) => {
        return valor >= 0;
    }
};

export default Validaciones;
