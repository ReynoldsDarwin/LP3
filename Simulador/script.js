// Función para mostrar el cambio en tiempo real del slider
function actualizarLectura() {
    const temp = document.getElementById("tempRange").value;
    document.getElementById("numTemp").innerText = temp;
}

function analizarClima() {
    // 1. CAPTURA DE DATOS
    const id = document.getElementById("sensorId").value; // Cadena
    const celsius = parseFloat(document.getElementById("tempRange").value); // Cuantitativo

    let estado = "";    // Cualitativo
    let alerta = "";    // Cadena
    let color = "";

    // 2. LÓGICA DE CLASIFICACIÓN (Switch-Case por Rangos)
    switch (true) {
        case (celsius < 0):
            estado = "Congelación";
            alerta = "Rango de hielo en tuberias.";
            color = "blue";
            break;
        case (celsius >= 0 && celsius < 15):
            estado = "Frío";
            alerta = "Ambiente fresco, Activar calefacción.";
            color = "cyan";
            break;
        case (celsius >= 15 && celsius < 30):
            estado = "Templado";
            alerta = "Condiciones óptimas.";
            color = "green";
            break;
        case (celsius >= 30):
            estado = "Calor Extremo";
            alerta = "Peligro de calentamiento.";
            color = "red";
            break;
        default:
            estado = "Datos Inválidos";
            alerta = "Por favor, ingresa una temperatura válida.";
            color = "gray";
    }
    

    // 3. MANIPULACIÓN DE CADENAS (Generar log de reporte)
    const logSeguridad = `[${id}] Reporta: ${estado}`;

    // 4. MOSTRAR RESULTADOS
    document.getElementById("txtEstado").innerText = logSeguridad;
    document.getElementById("txtAlerta").innerText = alerta;
    
    const indicador = document.getElementById("indicadorColor");
    indicador.style.borderBottomColor = color;
}