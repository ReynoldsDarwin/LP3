document.getElementById('btnCalcular').addEventListener('click', function() {
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const tipo = document.getElementById('producto').value;
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese cantidad válida");
        return;
    }

    let precio, descuento, impuesto = 0.18;

    switch (tipo) {
        case 'arroz': precio = 4.50; descuento = 0.05; break;
        case 'aceite': precio = 12.00; descuento = 0.10; break;
        case 'leche': precio = 5.20; descuento = 0.02; break;
        case 'vodka': precio = 100.00; descuento = 0.15; break;
    }

    // Cálculos
    const subtotalBruto = precio * cantidad;
    const montoDescuento = subtotalBruto * descuento;
    const baseImponible = subtotalBruto - montoDescuento;
    const iva = baseImponible * impuesto;
    const total = baseImponible + iva;

    // Asignación de resultados al HTML (Sin innerHTML)
    document.getElementById('resProducto').textContent = tipo.toUpperCase();
    document.getElementById('resCantidad').textContent = cantidad;
    document.getElementById('resSubtotal').textContent = 'S/ ' + subtotalBruto.toFixed(2);
    document.getElementById('resDescuento').textContent = '-S/ ' + montoDescuento.toFixed(2);
    document.getElementById('resIva').textContent = '+S/ ' + iva.toFixed(2);
    document.getElementById('resTotal').textContent = 'S/ ' + total.toFixed(2);

    // Mostrar el ticket
    document.getElementById('ticket').classList.remove('hidden');
});