let listaArtefactos = [];
const PRECIO_KWH = 0.5224; // Tomado de tu recibo

function agregarArtefacto() {
    const nombre = document.getElementById('producto').value;
    const watts = parseFloat(document.getElementById('watts').value);
    const horas = parseFloat(document.getElementById('horas').value);

    if (!nombre || isNaN(watts) || isNaN(horas)) {
        alert("Ingresa datos válidos");
        return;
    }

    // Calcular kWh individual
    const kwh = (watts * horas) / 1000;

    // Guardar en la lista
    listaArtefactos.push({ nombre, watts, horas, kwh });

    actualizarTabla();
    
    // Limpiar campos
    document.getElementById('producto').value = "";
    document.getElementById('watts').value = "";
    document.getElementById('horas').value = "";
    
    document.getElementById('btn-generar').style.display = "block";
}

function actualizarTabla() {
    const tbody = document.querySelector('#tabla-artefactos tbody');
    tbody.innerHTML = "";

    listaArtefactos.forEach(art => {
        const row = `<tr>
            <td>${art.nombre}</td>
            <td>${art.watts}W</td>
            <td>${art.horas}h</td>
            <td>${art.kwh.toFixed(3)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function generarRecibo() {
    let totalKwh = 0;
    const detalleDiv = document.getElementById('detalle-recibo');
    detalleDiv.innerHTML = "";

    listaArtefactos.forEach(art => {
        totalKwh += art.kwh;
        
        // Determinar nivel de consumo (Estructuras IF solicitadas)
        let nivel = "";
        if (art.kwh <= 1) nivel = "Eficiente";
        else if (art.kwh > 1 && art.kwh <= 3) nivel = "Moderado";
        else nivel = "Excesivo";

        const item = `<div class="recibo-row">
            <span>${art.nombre} (${nivel})</span>
            <span>${art.kwh.toFixed(2)} kWh</span>
        </div>`;
        detalleDiv.innerHTML += item;
    });

    const totalSoles = totalKwh * PRECIO_KWH;

    // Actualizar datos del recibo
    document.getElementById('total-kwh-recibo').textContent = totalKwh.toFixed(2) + " kWh";
    document.getElementById('total-soles').textContent = "S/. " + totalSoles.toFixed(2);

    // Mostrar recibo
    document.getElementById('recibo-container').style.display = "block";
    
    // Scroll suave hasta el recibo
    document.getElementById('recibo-container').scrollIntoView({ behavior: 'smooth' });
}