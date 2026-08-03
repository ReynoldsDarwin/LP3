/**
 * Sistema Experto de Triaje Hospitalario
 * Basado en Normativas de Priorización de Emergencias (Perú)
 */

function evaluarPaciente() {
    // Captura de datos
    const conciencia = document.getElementById('conciencia').value;
    const respiracion = document.getElementById('respiracion').value;
    const hemorragia = document.getElementById('hemorragia').value;
    const dolorPecho = document.getElementById('dolorPecho').value;
    const edad = document.getElementById('edad').value;
    const motivo = document.getElementById('motivo').value;
    
    const divResultado = document.getElementById('resultadoTriaje');
    
    // Objeto de decisión
    let p = { 
        nombre: "", 
        color: "", 
        area: "", 
        especialista: "", 
        tiempo: "", 
        indicacion: "" 
    };

    // --- LÓGICA DE CLASIFICACIÓN (TRIAGE) ---

    if (conciencia === "inconsciente" || respiracion === "severa" || hemorragia === "masiva") {
        p.nombre = "PRIORIDAD I: GRAVEDAD EXTREMA";
        p.color = "p1";
        p.area = "Unidad de Shock-Trauma";
        p.tiempo = "INMEDIATO (0 min)";
        p.indicacion = "Riesgo inminente de muerte. Requiere reanimación.";
    } 
    else if (dolorPecho === "si" || conciencia === "estupor" || respiracion === "leve") {
        p.nombre = "PRIORIDAD II: MUY URGENTE";
        p.color = "p2";
        p.area = "Tópico de Emergencias Internas";
        p.tiempo = "< 10 Minutos";
        p.indicacion = "Riesgo potencial de inestabilidad hemodinámica.";
    }
    else if (hemorragia === "controlada" || motivo === "quirurgico") {
        p.nombre = "PRIORIDAD III: URGENCIA MENOR";
        p.color = "p3";
        p.area = "Observación / Tópicos de Cirugía";
        p.tiempo = "< 60 Minutos";
        p.indicacion = "Paciente estable, requiere evaluación diagnóstica.";
    }
    else {
        p.nombre = "PRIORIDAD IV: NO URGENTE";
        p.color = "p4";
        p.area = "Triaje Rápido / Consultorios";
        p.tiempo = "Según disponibilidad";
        p.indicacion = "Condición sub-aguda o crónica. Puede ser derivado.";
    }

    // --- LÓGICA DE DERIVACIÓN (ESPECIALISTA) ---

    if (edad === "pediatrico") {
        p.especialista = "Médico Pediatra de Retén";
        if (p.color !== "p1") p.area = "Emergencia Pediátrica";
    } 
    else if (edad === "obstetrico") {
        p.especialista = "Gineco-Obstetra de Guardia";
        p.area = "Centro Obstétrico / Emergencia";
    } 
    else if (motivo === "trauma") {
        p.especialista = "Traumatólogo / Cirujano de Guardia";
    } 
    else if (motivo === "quirurgico") {
        p.especialista = "Cirujano General";
    } 
    else if (dolorPecho === "si") {
        p.especialista = "Cardiólogo / Intensivista";
    } 
    else {
        p.especialista = "Médico Emergenciólogo";
    }

    // --- RENDERIZADO DE RESULTADOS ---
    divResultado.innerHTML = `
        <div class="prioridad-box ${p.color}">
            ${p.nombre}
        </div>
        <div class="derivation-box">
            <p><strong>TIEMPO DE ESPERA:</strong> ${p.tiempo}</p>
            <p><strong>ÁREA DESTINO:</strong> <span class="badge-area">${p.area}</span></p>
            <p><strong>ESPECIALISTA:</strong> ${p.especialista}</p>
            <p style="margin-top:10px; border-top:1px solid #eee; padding-top:10px; color:#666; font-style:italic;">
                ${p.indicacion}
            </p>
        </div>
    `;
}