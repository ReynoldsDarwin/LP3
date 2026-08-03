function calcularHuella() {
    const kwh = parseFloat(document.getElementById('kwh').value);
    const divResultado = document.getElementById('resultado');

    if (isNaN(kwh) || kwh < 0) {
        divResultado.innerHTML = "<p style='color:red'>Por favor, ingresa un consumo válido.</p>";
        return;
    }

    // Cálculos
    const kgCO2 = (kwh * 0.4).toFixed(2);
    const arboles = Math.ceil(kgCO2 / 20); // Redondeamos hacia arriba
    
    let mensaje = "";

    // Lógica if-else para el nivel de impacto
    if (arboles <= 2) {
        mensaje = "Tu impacto es bajo. ¡Buen trabajo!";
    } else if (arboles <= 10) {
        mensaje = "Impacto moderado. Considera reducir el uso de energía.";
    } else {
        mensaje = "Impacto alto. Necesitas tomar medidas urgentes.";
    }

    divResultado.innerHTML = `
        <span class="co2-val">${kgCO2} kg CO₂</span>
        <p class="tree-info">Debes sembrar <span class="tree-num">${arboles} árbol(es)</span> al año para compensarlo.</p>
        <p style="font-size: 0.8rem; margin-top:10px italic;">${mensaje}</p>
    `;
}