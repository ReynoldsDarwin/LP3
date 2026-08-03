function analizarSalud() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const cintura = parseFloat(document.getElementById('cintura').value);
    const genero = document.getElementById('genero').value;
    const resDiv = document.getElementById('resultado');

    if (!peso || !altura || !cintura) {
        resDiv.innerHTML = "<p style='color:red'>Complete todos los campos</p>";
        return;
    }

    // 1. Cálculo de IMC
    const imc = (peso / (altura * altura)).toFixed(1);
    let imcCat = "";
    let imcColor = "normal";

    if (imc < 18.5) imcCat = "Bajo peso";
    else if (imc <= 24.9) imcCat = "Normal";
    else if (imc <= 29.9) { imcCat = "Sobrepeso"; imcColor = "high"; }
    else { imcCat = "Obesidad"; imcColor = "high"; }

    // 2. Riesgo Abdominal (Basado en Perímetro)
    let riesgoCat = "Normal";
    let riesgoColor = "normal";

    if (genero === "hombre") {
        if (cintura >= 102) { riesgoCat = "Elevado"; riesgoColor = "high"; }
        else if (cintura >= 94) { riesgoCat = "Moderado"; }
    } else {
        if (cintura >= 88) { riesgoCat = "Elevado"; riesgoColor = "high"; }
        else if (cintura >= 80) { riesgoCat = "Moderado"; }
    }

    resDiv.innerHTML = `
        <div class="metric">
            <span class="metric-label">ÍNDICE DE MASA CORPORAL</span>
            <span class="metric-val">${imc}</span>
            <span class="status-tag ${imcColor}">${imcCat}</span>
        </div>
        <div class="metric">
            <span class="metric-label">RIESGO CARDIOVASCULAR</span>
            <span class="metric-val">${cintura} cm</span>
            <span class="status-tag ${riesgoColor}">Riesgo: ${riesgoCat}</span>
        </div>
    `;
}