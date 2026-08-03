function calcularImpuestos() {
    const sueldo = parseFloat(document.getElementById('ingreso').value);
    
    if (isNaN(sueldo) || sueldo < 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }

    // Elementos del DOM
    const resDiv = document.getElementById('resultado');
    const catTxt = document.getElementById('categoria-text');
    const tasaTxt = document.getElementById('tasa-text');
    const montoFinal = document.getElementById('monto-final');

    let tasa = 0;
    let categoria = "";
    let claseCss = "";

    // Estructura Lógica de Justicia Tributaria
    if (sueldo < 1000) {
        tasa = 0;
        categoria = "Exento";
        claseCss = "exento";
    } 
    else if (sueldo > 1000 && sueldo <= 2500) {
        tasa = 0.10; // 10%
        categoria = "Tramo Bajo";
        claseCss = "bajo";
    } 
    else if (sueldo > 2500 && sueldo <= 5000) {
        tasa = 0.20; // 20%
        categoria = "Tramo Medio";
        claseCss = "medio";
    } 
    else {
        tasa = 0.35; // 35%
        categoria = "Tramo Alto";
        claseCss = "alto";
    }

    // Cálculo del impuesto
    const impuestoTotal = sueldo * tasa;

    // Mostrar Resultados
    catTxt.textContent = categoria;
    catTxt.className = claseCss; // Aplicar color dinámico
    
    tasaTxt.textContent = (tasa * 100) + "%";
    montoFinal.textContent = "S/. " + impuestoTotal.toLocaleString('en-US', {minimumFractionDigits: 2});

    resDiv.style.display = "block";
}