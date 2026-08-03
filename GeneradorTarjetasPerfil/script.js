function generarPerfil() {
    // 1. CAPTURA DE VALORES
    const nombre = document.getElementById("inputNombre").value;
    const paterno = document.getElementById("inputPaterno").value;
    const materno = document.getElementById("inputMaterno").value;
    const anioTexto = document.getElementById("inputAnio").value;
    const estado = document.getElementById("inputEstado").value;

    const anioActual = new Date().getFullYear();
    const edad = anioActual - Number(anioTexto);

    // 3. VALIDACIÓN
    if (nombre === "" || paterno === "" || materno === "" || anioTexto === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    document.getElementById("displayNombre").innerText = nombre.toUpperCase();
    document.getElementById("displayPaterno").innerText = paterno.toUpperCase();
    document.getElementById("displayMaterno").innerText = materno.toUpperCase();
    document.getElementById("displayEdad").innerText = "Edad: " + edad + " años";
    document.getElementById("displayEstado").innerText = "Estado actual: " + estado;

    const card = document.getElementById("card");
    if (estado === "Disponible") {
        card.style.borderLeft = "5px solid green";
    } else if (estado === "Ocupado") {
        card.style.borderLeft = "5px solid red";
    } else {
        card.style.borderLeft = "5px solid gray";
    }
}