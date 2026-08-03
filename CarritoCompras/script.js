function calcularTotal() {
    // CAPTURA DE CADENAS (Strings)
    const nombreProducto = document.getElementById("producto").value;
    
    // CAPTURA Y CONVERSIÓN A NÚMEROS (Cuantitativos)
    const precio = parseFloat(document.getElementById("precio").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const costoEnvio = parseFloat(document.getElementById("envio").value);

    // Validación básica
    if (nombreProducto === "" || isNaN(precio) || isNaN(cantidad)) {
        alert("Por favor, llena los datos correctamente.");
        return;
    }

    // OPERACIÓN CUANTITATIVA
    const subtotal = precio * cantidad;
    const impuesto = subtotal * 0.18; 
    const totalFinal = subtotal + impuesto + costoEnvio;

    // MANIPULACIÓN DE CADENAS (Template Strings)
    // Combinamos texto fijo con variables dinámicas
    const mensaje = `Has elegido ${cantidad} unidad(es) de "${nombreProducto.trim()}".`;
    
    // MOSTRAR EN PANTALLA
    document.getElementById("resTexto").innerText = mensaje;
    
    // Usamos .toFixed(2) para que el número (cuantitativo) 
    // se formatee como una cadena de precio válida
    document.getElementById("resTotal").innerText = `Total: $${totalFinal.toFixed(2)}`;

    // Lógica adicional basada en el dato Cualitativo (Envío)
    if (costoEnvio > 10) {
        document.getElementById("resTotal").style.color = "orange"; // Envío caro
    } else {
        document.getElementById("resTotal").style.color = "#4a69bd";
    }
}