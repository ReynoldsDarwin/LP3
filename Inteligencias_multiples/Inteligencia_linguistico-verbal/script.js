const questions = [
    {
        title: 'Pregunta 1 de 10: Vocabulario Avanzado',
        instruction: 'Selecciona el sinónimo correcto para la palabra resaltada:',
        word: 'Inmarcesible',
        options: ['Que no se puede marchitar', 'Que se mueve con facilidad', 'Muy fragante', 'De corta duración'],
        correct: 0
    },
    {
        title: 'Pregunta 2 de 10: Comprensión Léxica',
        instruction: 'Selecciona el significado más preciso para la palabra:',
        word: 'Inefable',
        options: ['Incapaz de cometer errores', 'Que produce un sonido armónico', 'Que no se puede explicar con palabras', 'Que carece de valor real'],
        correct: 2
    },
    {
        title: 'Pregunta 3 de 10: Analogías Verbales',
        instruction: 'Completa la relación analógica: ANTORCHA es a LIBERTAD como...',
        word: 'ANTORCHA : LIBERTAD ::',
        options: ['Paloma : Paz', 'Balanza : Comercio', 'Cadenas : Esclavitud', 'Corazón : Sentimiento'],
        correct: 0
    },
    {
        title: 'Pregunta 4 de 10: Conectores Sintácticos',
        instruction: 'Elige los conectores que den sentido lógico a la oración:',
        word: '«El arte ________ la literatura no son un lujo, ________ una necesidad del espíritu».',
        options: ['o - sino', 'y - sino', 'ni - sino también', 'pero - y'],
        correct: 1
    },
    {
        title: 'Pregunta 5 de 10: Precisión Semántica',
        instruction: 'Selecciona el antónimo directo de la palabra destacada:',
        word: 'Ecuánime',
        options: ['Sereno', 'Injusto', 'Parcializado', 'Ignorante'],
        correct: 2
    },
    {
        title: 'Pregunta 6 de 10: Analogías Verbales',
        instruction: 'Completa la relación analógica: ORO es a METAL como...',
        word: 'ORO : METAL ::',
        options: ['Tigre : Mamífero', 'Fuego : Calor', 'Rosa : Espina', 'Agua : Líquido'],
        correct: 0
    },
    {
        title: 'Pregunta 7 de 10: Etimología',
        instruction: '¿Cuál es el significado del prefijo de origen griego "Miso-" (como en Misantropía o Misoginia)?',
        word: 'Prefijo: MISO-',
        options: ['Mitad o medio', 'Aversión u odio', 'Igual o semejante', 'Forma o estructura'],
        correct: 1
    },
    {
        title: 'Pregunta 8 de 10: Coherencia Sintáctica',
        instruction: 'Elige la opción que ordena y da sentido perfecto a esta estructura desordenada: "lenguaje / espejo / el / alma / del / es / el"',
        word: 'Estructura Sintáctica',
        options: [
            'El espejo del alma es lenguaje el',
            'El lenguaje es el espejo del alma',
            'Es el espejo del alma el lenguaje',
            'El alma es el espejo del lenguaje'
        ],
        correct: 1
    },
    {
        title: 'Pregunta 9 de 10: Sinonimia Conceptual',
        instruction: '¿Cuál es el sinónimo de la palabra destacada?',
        word: 'Locuacidad',
        options: ['Timidez al expresarse', 'Elocuencia o fluidez al hablar', 'Falta de coherencia verbal', 'Sabiduría profunda'],
        correct: 1
    },
    {
        title: 'Pregunta 10 de 10: Comprensión y Definición',
        instruction: '¿Qué palabra define a alguien que habla con un tono afectado, pomposo o usando palabras excesivamente cultas de forma pretenciosa?',
        word: 'Definición Conceptual',
        options: ['Pedante', 'Lacónico', 'Altruista', 'Incipiente'],
        correct: 0
    }
];

let currentIndex = 0;
let score = 0;
let currentSelectedOption = null;

const contentDiv = document.getElementById('test-content');
const progressDiv = document.getElementById('progress');

function renderQuestion() {
    // Actualizar barra de progreso
    const progressPercent = (currentIndex / questions.length) * 100;
    progressDiv.style.width = `${progressPercent}%`;

    const q = questions[currentIndex];
    
    let html = `
        <h2 class="question-title">${q.title}</h2>
        <p class="instruction">${q.instruction}</p>
        <div class="word-display">${q.word}</div>
        <div id="options-container">
    `;
    
    q.options.forEach((opt, i) => {
        html += `<button class="option-btn" onclick="selectOption(${i}, this)">${opt}</button>`;
    });
    
    html += `
        </div>
        <button class="btn-primary" id="next-btn" disabled onclick="nextQuestion()">
            ${currentIndex === questions.length - 1 ? 'Finalizar Test' : 'Siguiente'}
        </button>
    `;

    contentDiv.innerHTML = html;
}

function selectOption(index, btnElement) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    
    currentSelectedOption = index;
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    const q = questions[currentIndex];
    
    // Sumar 10 puntos si es correcta
    if (currentSelectedOption === q.correct) {
        score += 10;
    }
    
    currentSelectedOption = null;
    currentIndex++;
    
    if (currentIndex < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    progressDiv.style.width = '100%';
    
    let message = "";
    if (score === 100) message = "¡Excepcional! Tu inteligencia lingüístico-verbal es magistral.";
    else if (score >= 80) message = "¡Excelente! Posees un dominio léxico y semántico avanzado.";
    else if (score >= 60) message = "Buen trabajo. Tus habilidades verbales son sólidas.";
    else if (score >= 40) message = "Puntuación regular. Se recomienda ejercitar más la lectura y el léxico.";
    else message = "Puntuación baja. Te invitamos a repasar conectores y ampliar tu vocabulario diario.";

    contentDiv.innerHTML = `
        <div class="results-container">
            <h2 class="question-title">Resultados del Test</h2>
            <p class="instruction">Evaluación de Inteligencia Verbal Finalizada</p>
            
            <div class="score-circle">
                ${score}
            </div>
            
            <p class="feedback-msg">${message}</p>
            
            <button class="btn-primary" onclick="location.reload()">Reintentar Test</button>
        </div>
    `;
}

window.onload = renderQuestion;