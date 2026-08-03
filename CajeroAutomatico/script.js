// Definimos el saldo como un número (Dato Cuantitativo inicial)
let saldoActual = 1000.00;

function operar() {
    // 1. CAPTURA Y CONVERSIÓN
    // Forzamos que el valor del input sea un Número, no una Cadena
    const montoInput = document.getElementById("monto").value;
    const monto = parseFloat(montoInput);
    
    // Captura de dato Cualitativo
    const operacion = document.getElementById("tipoOperacion").value;
    
    const displaySaldo = document.getElementById("saldoDisplay");
    const displayMensaje = document.getElementById("mensajeEstado");
    const nombreCliente = document.getElementById("nombre").value.trim();

    // 2. VALIDACIÓN LÓGICA
    if (operacion !== "consultar" && (isNaN(monto) || monto <= 0)) {
        displayMensaje.innerText = "Error: Ingrese un monto válido.";
        displayMensaje.style.color = "#ff8a80";
        return;
    }

    // 3. PROCESAMIENTO CON SWITCH (Basado en categoría cualitativa)
    switch (operacion) {
        case "depositar":
            // Operación cuantitativa real (Suma de números)
            saldoActual = saldoActual + monto;
            displayMensaje.innerText = `Depósito procesado con éxito, ${nombreCliente}.`;
            displayMensaje.style.color = "#84c8e8";
            break;

        case "retirar":
            if (monto <= saldoActual) {
                saldoActual = saldoActual - monto;
                displayMensaje.innerText = `Retiro procesado, ${nombreCliente}. Retire su dinero.`;
                displayMensaje.style.color = "#0fe74d";
            } else {
                displayMensaje.innerText = "Fondos insuficientes.";
                displayMensaje.style.color = "#ea200e";
            }
            break;

        case "consultar":
            displayMensaje.innerText = `Consulta de saldo realizada, ${nombreCliente}.`;
            displayMensaje.style.color = "#290beb";
            break;
    }

    // 4. ACTUALIZACIÓN DE LA INTERFAZ (Convertir número a cadena legible)
    // .toFixed(2) asegura que siempre veamos dos decimales
    displaySaldo.innerText = "$" + saldoActual.toFixed(2);
    
    // Limpiamos el input para la siguiente operación
    document.getElementById("monto").value = "";
}