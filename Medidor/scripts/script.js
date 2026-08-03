function calcularConsumo() {
    // Obtener valores de los inputs
    const producto = document.getElementById('producto').value;
    const watts = parseFloat(document.getElementById('watts').value);
    const horas = parseFloat(document.getElementById('horas').value);

    // Validar que los campos no estén vacíos
    if (!producto || isNaN(watts) || isNaN(horas)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    // Aplicar fórmula: kWh = (Watt * hora) / 1000
    const kwh = (watts * horas) / 1000;

    // Referencias a elementos de resultado
    const resDiv = document.getElementById('resultado');
    const resProducto = document.getElementById('res-producto');
    const resKwh = document.getElementById('res-kwh');
    const resCategoria = document.getElementById('res-categoria');

    // Estructuras IF para determinar el tipo de consumo
    let categoria = "";
    let claseCss = "";

    if (kwh <= 1) {
        categoria = "Consumo Eficiente";
        claseCss = "eficiente";
    } else if (kwh > 1 && kwh <= 3) {
        categoria = "Consumo Moderado";
        claseCss = "moderado";
    } else {
        categoria = "Consumo Excesivo";
        claseCss = "excesivo";
    }

    // Mostrar resultados en el DOM
    resProducto.textContent = producto;
    resKwh.textContent = kwh.toFixed(3); // Mostramos 3 decimales
    resCategoria.textContent = categoria;
    
    // Limpiar clases previas y añadir la nueva
    resCategoria.className = "badge " + claseCss;
    
    // Mostrar el contenedor de resultados
    resDiv.style.display = "block";
}