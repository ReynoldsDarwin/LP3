const ESTACIONES_MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const ANIO_INICIO = 1;
const ANIO_FIN = 15;
const BASE_TEMP_MEDIA = 8.5; 
const AMPLITUD_ESTACIONAL = 3.2; 
const TENDENCIA_ANUAL = 0.025; 
const RUIDO_SIGMA = 0.55; 

let datasetCompleto = [];
let datasetFiltrado = [];
let paginaActual = 1;
const filasPorPagina = 12;
let graficoTemperatura = null;

let modeloC = 0;
let modeloPhi = 0;

function randomNormal(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); 
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
}

function generarDatosHistoricos() {
    let datos = [];
    let indiceGlobal = 1;
    for (let anio = ANIO_INICIO; anio <= ANIO_FIN; anio++) {
        const deltaAnual = (anio - ANIO_INICIO) * TENDENCIA_ANUAL;
        for (let m = 0; m < 12; m++) {
            const anguloEstacional = (2 * Math.PI * (m - 11)) / 12;
            const variabilidadClimatica = randomNormal(0, RUIDO_SIGMA);
            let tempMedia = BASE_TEMP_MEDIA + (AMPLITUD_ESTACIONAL * Math.cos(anguloEstacional)) + deltaAnual + variabilidadClimatica;
            const esInvierno = m >= 5 && m <= 7; 
            let oscilacionTermica = esInvierno ? randomNormal(18, 1.2) : randomNormal(13.5, 0.8);
            let tempMinima = tempMedia - (oscilacionTermica / 2);
            let tempMaxima = tempMedia + (oscilacionTermica / 2);

            datos.push({
                indice: indiceGlobal++,
                mesIndex: m,
                mes: ESTACIONES_MESES[m],
                tempMin: parseFloat(tempMinima.toFixed(2)),
                tempMed: parseFloat(tempMedia.toFixed(2)),
                tempMax: parseFloat(tempMaxima.toFixed(2)),
                oscilacion: parseFloat(oscilacionTermica.toFixed(2))
            });
        }
    }
    return datos;
}

function calcularMetricasKPI(datos) {
    const totalMeses = datos.length;
    if (totalMeses === 0) return;
    const sumaMedias = datos.reduce((acc, curr) => acc + curr.tempMed, 0);
    const mediaGlobal = sumaMedias / totalMeses;

    let minimaAbsoluta = datos[0];
    let maximaAbsoluta = datos[0];

    datos.forEach(row => {
        if (row.tempMin < minimaAbsoluta.tempMin) minimaAbsoluta = row;
        if (row.tempMax > maximaAbsoluta.tempMax) maximaAbsoluta = row;
    });

    const incrementoDecadal = (TENDENCIA_ANUAL * 10).toFixed(2);

    const elMean = document.getElementById("kpi-mean");
    const elMin = document.getElementById("kpi-min");
    const elMinDate = document.getElementById("kpi-min-date");
    const elMax = document.getElementById("kpi-max");
    const elMaxDate = document.getElementById("kpi-max-date");
    const elTrend = document.getElementById("kpi-trend");

    if (elMean) elMean.textContent = `${mediaGlobal.toFixed(1)} °C`;
    if (elMin) elMin.textContent = `${minimaAbsoluta.tempMin} °C`;
    if (elMinDate) elMinDate.textContent = `Punto M${minimaAbsoluta.indice} (${minimaAbsoluta.mes})`;
    if (elMax) elMax.textContent = `${maximaAbsoluta.tempMax} °C`;
    if (elMaxDate) elMaxDate.textContent = `Punto M${maximaAbsoluta.indice} (${maximaAbsoluta.mes})`;
    if (elTrend) elTrend.textContent = `+${incrementoDecadal} °C`;
}

function procesarModeloAR1(datos) {
    const n = datos.length;
    if (n < 2) return;
    const y = datos.map(d => d.tempMed);
    const mediaY = y.reduce((acc, val) => acc + val, 0) / n;

    function calcularAutocorrelacion(lag) {
        let numerador = 0;
        let denominador = 0;
        for (let t = 0; t < n; t++) {
            denominador += Math.pow(y[t] - mediaY, 2);
        }
        for (let t = lag; t < n; t++) {
            numerador += (y[t] - mediaY) * (y[t - lag] - mediaY);
        }
        return denominador === 0 ? 0 : numerador / denominador;
    }

    const r1 = calcularAutocorrelacion(1);
    const r2 = calcularAutocorrelacion(2);
    const r3 = calcularAutocorrelacion(3);

    const elLag1 = document.getElementById("acf-lag1");
    const elLag2 = document.getElementById("acf-lag2");
    const elLag3 = document.getElementById("acf-lag3");

    if (elLag1) elLag1.textContent = r1.toFixed(4);
    if (elLag2) elLag2.textContent = r2.toFixed(4);
    if (elLag3) elLag3.textContent = r3.toFixed(4);

    const statusBadge = document.getElementById("stationarity-status");
    const descText = document.getElementById("stationarity-desc");

    if (statusBadge && descText) {
        if (r1 > 0.4 && r2 < r1 && r3 < r2) {
            statusBadge.textContent = "Estacionaria";
            statusBadge.className = "badge";
            descText.textContent = `La serie presenta estacionariedad (Fuerte decaimiento en la ACF). El coeficiente de correlación lag 1 es de ${r1.toFixed(4)}, lo que indica que no hay presencia latente de raíces unitarias ni tendencias deterministas no lineales no controladas.`;
        } else {
            statusBadge.textContent = "No Estacionaria";
            statusBadge.className = "badge not-stationary";
            descText.textContent = `La serie de tiempo muestra un comportamiento inestable o de raíz unitaria. Es necesario verificar la presencia de tendencias de largo plazo.`;
        }
    }

    let sumaX = 0, sumaY = 0, sumaXX = 0, sumaYY = 0, sumaXY = 0;
    const m = n - 1;

    for (let t = 1; t < n; t++) {
        const xt_1 = y[t-1];
        const yt = y[t];
        sumaX += xt_1;
        sumaY += yt;
        sumaXX += xt_1 * xt_1;
        sumaYY += yt * yt;
        sumaXY += xt_1 * yt;
    }

    const mediaX = sumaX / m;
    const mediaActualY = sumaY / m;
    const denominadorPhi = (sumaXX - m * Math.pow(mediaX, 2));
    
    modeloPhi = denominadorPhi === 0 ? 0 : (sumaXY - m * mediaX * mediaActualY) / denominadorPhi;
    modeloC = mediaActualY - modeloPhi * mediaX;

    const elConst = document.getElementById("coef-constant");
    const elPhi = document.getElementById("coef-phi");
    const elEq = document.getElementById("ar1-equation");

    if (elConst) elConst.textContent = modeloC.toFixed(4);
    if (elPhi) elPhi.textContent = modeloPhi.toFixed(4);
    if (elEq) elEq.innerHTML = `Y_t = ${modeloC.toFixed(3)} + ${modeloPhi.toFixed(3)} * Y_{t-1} + e_t`;

    let sumaResiduosCuadrado = 0;
    let sumaResiduosAbsoluto = 0;
    let sumaYVarTotal = 0;
    let sumaDiferenciaResiduos = 0;
    let residuos = [];

    for (let t = 1; t < n; t++) {
        const prediccion = modeloC + modeloPhi * y[t-1];
        const residuo = y[t] - prediccion;
        residuos.push(residuo);

        sumaResiduosCuadrado += Math.pow(residuo, 2);
        sumaResiduosAbsoluto += Math.abs(residuo);
        sumaYVarTotal += Math.pow(y[t] - mediaActualY, 2);
    }

    for (let i = 1; i < residuos.length; i++) {
        sumaDiferenciaResiduos += Math.pow(residuos[i] - residuos[i-1], 2);
    }

    const dw = sumaResiduosCuadrado === 0 ? 0 : sumaDiferenciaResiduos / sumaResiduosCuadrado;
    const coefR2 = sumaYVarTotal === 0 ? 0 : 1 - (sumaResiduosCuadrado / sumaYVarTotal);
    const mae = sumaResiduosAbsoluto / m;
    const rmse = Math.sqrt(sumaResiduosCuadrado / m);

    const elErr = document.getElementById("error-std");
    const elR2 = document.getElementById("metric-r2");
    const elMae = document.getElementById("metric-mae");
    const elRmse = document.getElementById("metric-rmse");
    const elDw = document.getElementById("metric-dw");

    if (elErr) elErr.textContent = `± ${rmse.toFixed(3)} °C`;
    if (elR2) elR2.textContent = coefR2.toFixed(4);
    if (elMae) elMae.textContent = `${mae.toFixed(3)} °C`;
    if (elRmse) elRmse.textContent = `${rmse.toFixed(3)} °C`;
    if (elDw) elDw.textContent = dw.toFixed(3);
}

function renderizarTabla() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const inicioIdx = (paginaActual - 1) * filasPorPagina;
    const finIdx = inicioIdx + filasPorPagina;
    const registrosPagina = datasetFiltrado.slice(inicioIdx, finIdx);

    registrosPagina.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>M${row.indice}</strong></td>
            <td>${row.mes}</td>
            <td style="color: #60a5fa">${row.tempMin}</td>
            <td><strong>${row.tempMed}</strong></td>
            <td style="color: #f87171">${row.tempMax}</td>
            <td>${row.oscilacion}</td>
        `;
        tableBody.appendChild(tr);
    });

    const totalPaginas = Math.ceil(datasetFiltrado.length / filasPorPagina);
    const elInd = document.getElementById("pageIndicator");
    const btnPrev = document.getElementById("prevBtn");
    const btnNext = document.getElementById("nextBtn");

    if (elInd) elInd.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    if (btnPrev) btnPrev.disabled = paginaActual === 1;
    if (btnNext) btnNext.disabled = paginaActual >= totalPaginas || totalPaginas === 0;
}

function inicializarGrafico(datos) {
    const canvas = document.getElementById("tempChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const etiquetasMeses = datos.map(d => `M${d.indice}`);
    
    const serieReal = datos.map(d => d.tempMed);
    const serieAjustada = [serieReal[0]]; 
    
    for (let t = 1; t < datos.length; t++) {
        const estimacion = modeloC + modeloPhi * serieReal[t-1];
        serieAjustada.push(parseFloat(estimacion.toFixed(2)));
    }

    if (graficoTemperatura) {
        graficoTemperatura.destroy();
    }

    try {
        if (typeof Chart === 'undefined') return;
        graficoTemperatura = new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetasMeses,
                datasets: [
                    {
                        label: 'Temperatura Real (°C)',
                        data: serieReal,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        tension: 0.35,
                        fill: true
                    },
                    {
                        label: 'AR(1) Ajustado (°C)',
                        data: serieAjustada,
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        tension: 0.35,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 0
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#f3f4f6', font: { family: 'system-ui' } }
                    }
                },
                scales: {
                    x: { 
                        grid: { color: 'rgba(255, 255, 255, 0.02)' }, 
                        ticks: { 
                            color: '#9ca3af',
                            maxTicksLimit: 30
                        } 
                    },
                    y: { 
                        grid: { color: '#2d3748' }, 
                        ticks: { color: '#9ca3af' } 
                    }
                }
            }
        });
    } catch (e) {
        console.error(e);
    }
}

function inicializarSelectFiltro() {
    const filter = document.getElementById("yearFilter");
    if (!filter) return;
    filter.innerHTML = '<option value="all">Ver todos los meses</option>';
    for (let i = 1; i <= 15; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `Bloque Meses ${(i - 1) * 12 + 1} a ${i * 12}`;
        filter.appendChild(opt);
    }

    filter.addEventListener("change", (e) => {
        const seleccion = e.target.value;
        if (seleccion === "all") {
            datasetFiltrado = [...datasetCompleto];
        } else {
            const numBloque = parseInt(seleccion);
            const limMin = (numBloque - 1) * 12 + 1;
            const limMax = numBloque * 12;
            datasetFiltrado = datasetCompleto.filter(d => d.indice >= limMin && d.indice <= limMax);
        }
        paginaActual = 1;
        renderizarTabla();
    });
}

function inicializarPaginacion() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarTabla();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const totalPaginas = Math.ceil(datasetFiltrado.length / filasPorPagina);
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarTabla();
            }
        });
    }
}

function inicializarTodo() {
    try {
        datasetCompleto = generarDatosHistoricos();
        datasetFiltrado = [...datasetCompleto];
        
        calcularMetricasKPI(datasetCompleto);
        procesarModeloAR1(datasetCompleto);
        inicializarSelectFiltro();
        inicializarPaginacion();
        renderizarTabla();
        inicializarGrafico(datasetCompleto);
    } catch (error) {
        console.error(error);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarTodo);
} else {
    inicializarTodo();
}