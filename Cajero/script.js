// Simulamos un saldo inicial en la cuenta
let saldoDisponible = 5000.00;

function procesarRetiro() {
    const inputMonto = document.getElementById('monto');
    const montoARetirar = parseFloat(inputMonto.value);
    const statusBox = document.getElementById('status-box');
    const mensajeFeedback = document.getElementById('mensaje-feedback');
    const displaySaldo = document.getElementById('display-saldo');

    // Reiniciar estados visuales
    statusBox.className = "status-box";
    
    // CONDICIÓN 1: Verificar si la cantidad es mayor a cero
    if (isNaN(montoARetirar) || montoARetirar <= 0) {
        mostrarError("El monto debe ser mayor a cero.");
        return;
    }

    // CONDICIÓN 2: Verificar si tiene suficiente saldo
    if (montoARetirar > saldoDisponible) {
        mostrarError("Fondos insuficientes para esta operación.");
    } else {
        // Si ambas condiciones se cumplen, proceder
        ejecutarTransaccion(montoARetirar);
    }

    function mostrarError(msj) {
        statusBox.classList.add('error');
        mensajeFeedback.innerText = msj;
    }

    function ejecutarTransaccion(cantidad) {
        saldoDisponible -= cantidad; // Restar del saldo
        
        // Actualizar interfaz
        displaySaldo.innerText = `$${saldoDisponible.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        statusBox.classList.add('success');
        mensajeFeedback.innerText = "Retiro exitoso. Retire su efectivo.";
        
        // Limpiar input
        inputMonto.value = "";
    }
}