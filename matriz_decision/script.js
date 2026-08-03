document.addEventListener("DOMContentLoaded", () => {
    // 1. Definición de las plantillas (Templates)
    const templates = {
        carrera: {
            options: ["Ingeniería de Software", "Diseño Gráfico", "Economía"],
            criteria: [
                { name: "Pasión / Interés", weight: 5 },
                { name: "Salario Esperado", weight: 4 },
                { name: "Demanda Laboral", weight: 4 },
                { name: "Costo de Estudios", weight: 2 },
                { name: "Flexibilidad (Remoto)", weight: 3 }
            ]
        },
        mudanza: {
            options: ["Quedarme en mi ciudad", "Mudarme a la Capital", "Irme al Extranjero"],
            criteria: [
                { name: "Costo de Vida", weight: 5 },
                { name: "Oportunidades Laborales", weight: 5 },
                { name: "Cercanía a la Familia", weight: 4 },
                { name: "Clima", weight: 2 },
                { name: "Seguridad", weight: 4 }
            ]
        },
        auto: {
            options: ["Toyota Corolla (Usado)", "Tesla Model 3 (Nuevo)", "Honda CR-V (Nuevo)"],
            criteria: [
                { name: "Precio de Compra", weight: 5 },
                { name: "Consumo de Combustible/Energía", weight: 4 },
                { name: "Costos de Mantenimiento", weight: 4 },
                { name: "Espacio / Comodidad", weight: 3 },
                { name: "Estética", weight: 2 }
            ]
        }
    };

    const table = document.getElementById("decision-matrix");
    const winnerText = document.getElementById("winner-text");
    const tabBtns = document.querySelectorAll(".tab-btn");

    let currentTemplate = "carrera";
    
    // Matriz temporal para guardar las puntuaciones que el usuario ingresa (1-10)
    let currentScores = []; 

    // 2. Función para inicializar y renderizar la tabla
    function renderTable(templateKey) {
        const data = templates[templateKey];
        table.innerHTML = "";
        
        // Inicializar puntuaciones por defecto (valor 5 para todo)
        currentScores = data.criteria.map(() => data.options.map(() => 5));

        // Construir Cabecera
        let thead = `<tr>
            <th>Criterio</th>
            <th>Peso (1-5)</th>`;
        data.options.forEach(opt => {
            thead += `<th>${opt}</th>`;
        });
        thead += `</tr>`;
        
        // Construir Cuerpo (Criterios y Inputs)
        let tbody = "";
        data.criteria.forEach((crit, critIndex) => {
            tbody += `<tr>
                <td>${crit.name}</td>
                <td>
                    <input type="number" min="1" max="5" value="${crit.weight}" 
                           class="weight-input" data-crit="${critIndex}">
                </td>`;
            
            data.options.forEach((opt, optIndex) => {
                tbody += `<td>
                    <input type="number" min="1" max="10" value="5" 
                           class="score-input" data-crit="${critIndex}" data-opt="${optIndex}">
                </td>`;
            });
            tbody += `</tr>`;
        });

        // Construir Fila de Totales
        let tfoot = `<tr class="total-row">
            <td colspan="2" style="text-align: right; padding-right: 2rem;">PUNTUACIÓN TOTAL:</td>`;
        data.options.forEach((_, optIndex) => {
            tfoot += `<td id="total-opt-${optIndex}">0</td>`;
        });
        tfoot += `</tr>`;

        table.innerHTML = thead + tbody + tfoot;

        // Añadir Event Listeners a los inputs recién creados
        document.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", calculateTotals);
        });

        calculateTotals();
    }

    // 3. Función para calcular totales dinámicamente
    function calculateTotals() {
        const data = templates[currentTemplate];
        const weights = [];
        let totals = new Array(data.options.length).fill(0);

        // Obtener pesos actuales
        document.querySelectorAll(".weight-input").forEach(input => {
            let val = parseFloat(input.value) || 0;
            weights[input.dataset.crit] = val;
        });

        // Sumatoria (Peso * Puntuación)
        document.querySelectorAll(".score-input").forEach(input => {
            let val = parseFloat(input.value) || 0;
            let cIndex = input.dataset.crit;
            let oIndex = input.dataset.opt;
            
            totals[oIndex] += weights[cIndex] * val;
        });

        // Actualizar UI y encontrar ganador
        let maxTotal = -1;
        let winnerIndex = -1;

        totals.forEach((total, index) => {
            const cell = document.getElementById(`total-opt-${index}`);
            cell.textContent = total;
            cell.classList.remove("winner-col");
            
            if (total > maxTotal) {
                maxTotal = total;
                winnerIndex = index;
            }
        });

        // Resaltar ganador
        if (winnerIndex !== -1) {
            document.getElementById(`total-opt-${winnerIndex}`).classList.add("winner-col");
            winnerText.textContent = data.options[winnerIndex];
        }
    }

    // 4. Lógica de Pestañas
    tabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Manejo visual de botones
            tabBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            // Cambiar plantilla
            currentTemplate = e.target.dataset.template;
            renderTable(currentTemplate);
        });
    });

    // Inicialización del primer render
    renderTable(currentTemplate);
});