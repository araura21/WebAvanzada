
class ClienteService {

  calcularCliente(data) {
    const { saldoAnterior, montoCompras, pagoRealizado } = data;

    // Regla de negocio (asumida): El pago mínimo anterior era el 15% del saldo anterior.
    // Si el pago realizado es menor a ese monto, es moroso.
    const pagoMinimoAnterior = saldoAnterior * 0.15;
    const esMoroso = pagoRealizado < pagoMinimoAnterior;

    // Saldo Base = Saldo Anterior - Pago + Compras
    const saldoBase = saldoAnterior - pagoRealizado + montoCompras;

    let interes = 0;
    let multa = 0;

    if (esMoroso) {
      // Interés: 12% de los intereses causados por no realizar el pago mínimo.
      // Interpretación: 12% del saldo pendiente? O 12% del pago mínimo no realizado?
      // "saldo actual debe incluir 12% de los intereses causados..."
      // Usualmente es 12% del saldo base.
      interes = saldoBase * 0.12;
      multa = 200;
    }

    // Saldo Actual
    const saldoActual = saldoBase + interes + multa;

    // Pago Mínimo (Nuevo): 15% del saldo actual
    const pagoMinimo = saldoActual * 0.15;

    // Pago para no generar intereses: 85% del saldo actual
    const pagoNoIntereses = saldoActual * 0.85;

    return {
      saldoAnterior,
      montoCompras,
      pagoRealizado,
      saldoBase, // Opcional, para debug
      pagoMinimoAnterior, // Opcional
      esMoroso,
      interes,
      multa,
      saldoActual,
      pagoMinimo,
      pagoNoIntereses
    };
  }
}

export default new ClienteService();
