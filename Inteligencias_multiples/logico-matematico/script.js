const questions = [
{
    question: "¿Disfrutas resolver problemas matemáticos complejos?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Te gusta identificar patrones o secuencias en datos?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Analizas las causas y consecuencias antes de tomar decisiones?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Te resulta sencillo interpretar gráficos, tablas o estadísticas?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Prefieres resolver problemas utilizando lógica antes que intuición?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Disfrutas juegos de estrategia como ajedrez, sudoku o rompecabezas?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Te gusta trabajar con números y cálculos?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Buscas explicaciones racionales para comprender situaciones?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Sueles organizar información en categorías o estructuras?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
},
{
    question: "¿Disfrutas aprender conceptos científicos o tecnológicos?",
    answers: ["Nunca", "Rara vez", "Frecuentemente", "Siempre"]
}
];

const scores = [1, 2, 3, 4];

let currentQuestion = 0;
let totalScore = 0;
let selectedAnswer = null;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function loadQuestion() {

    const q = questions[currentQuestion];

    questionEl.textContent = q.question;

    answersEl.innerHTML = "";

    selectedAnswer = null;

    q.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.classList.add("answer-btn");

        button.textContent = answer;

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".answer-btn")
                .forEach(btn => btn.classList.remove("selected"));

            button.classList.add("selected");

            selectedAnswer = scores[index];
        });

        answersEl.appendChild(button);
    });

    updateProgress();
}

function updateProgress() {

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = `${progress}%`;

    document.getElementById("questionCounter").textContent =
        `Pregunta ${currentQuestion + 1} de ${questions.length}`;

    document.getElementById("progressPercent").textContent =
        `${Math.round(progress)}%`;
}

nextBtn.addEventListener("click", () => {

    if (selectedAnswer === null) {
        alert("Por favor selecciona una respuesta.");
        return;
    }

    totalScore += selectedAnswer;

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {

    document.querySelector(".quiz-card")
        .classList.add("hidden");

    document.querySelector(".progress-wrapper")
        .classList.add("hidden");

    document.getElementById("resultContainer")
        .classList.remove("hidden");

    document.getElementById("scoreText").textContent =
        `Puntuación obtenida: ${totalScore} de 40 puntos`;

    let level = "";
    let description = "";

    if (totalScore <= 15) {
        level = "Nivel Bajo";
        description = "Tu inteligencia lógico-matemática puede fortalecerse mediante ejercicios de razonamiento, análisis y resolución de problemas.";
    }
    else if (totalScore <= 25) {
        level = "Nivel Medio";
        description = "Posees habilidades lógico-matemáticas moderadas y puedes desarrollarlas aún más con práctica constante.";
    }
    else if (totalScore <= 35) {
        level = "Nivel Alto";
        description = "Tienes una buena capacidad para analizar situaciones, identificar patrones y resolver problemas.";
    }
    else {
        level = "Nivel Muy Alto";
        description = "Destacas en razonamiento lógico, pensamiento analítico y comprensión de relaciones matemáticas complejas.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level}</strong><br><br>
        ${description}
    `;
}

loadQuestion();