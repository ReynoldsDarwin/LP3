function calcularPromedio() {
    // 1. CAPTURA DE DATOS
    const nombre = document.getElementById("estudiante").value.trim();
    const n1 = parseFloat(document.getElementById("nota1").value);
    const n2 = parseFloat(document.getElementById("nota2").value);

    // Validación
    if (nombre === "" || isNaN(n1) || isNaN(n2)) {
        alert("Por favor, completa los datos correctamente.");
        return;
    }

    // 2. CÁLCULO CUANTITATIVO
    const promedio = (n1 + n2) / 2;
    const redondeado = Math.round(promedio) ; // Redondeo a 2 decimales

    // 3. TRANSFORMACIÓN A CUALITATIVO (Switch-Case por Rangos)
    // Usamos Math.floor para obtener el entero y clasificar
    let letra = "";
    let mensaje = "";
    let color = "";

    // Clasificación cualitativa basada en el promedio cuantitativo


    // 4. MOSTRAR RESULTADOS (Cadenas y Estilos)
    document.getElementById("boleta").style.display = "block";
    document.getElementById("txtAlumno").innerText = nombre.toUpperCase();
    document.getElementById("txtPromedio").innerText = redondeado.toFixed(2);

    if (redondeado <=10) {
        mensaje = "Desaprobado";
        color = "red";
    } else if (redondeado >= 11) {
        mensaje = "Aprobado";
        color = "blue";
    }

    const statusBox = document.getElementById("statusBox");
    statusBox.style.backgroundColor = color;
    statusBox.style.color = "white";
    
    document.getElementById("txtLetra").innerText = letra;
    document.getElementById("txtMensaje").innerText = mensaje;
}