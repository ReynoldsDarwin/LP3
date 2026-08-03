const questions = [

{
question:"¿Reconoces fácilmente tus fortalezas y debilidades?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reflexionas sobre tus decisiones para aprender de ellas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Comprendes las emociones que experimentas en diferentes situaciones?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Tienes objetivos personales claramente definidos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles analizar tus errores para mejorar?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Eres consciente de cómo tus emociones afectan tus acciones?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Dedicas tiempo a reflexionar sobre tu crecimiento personal?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te conoces lo suficiente como para saber qué te motiva?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes identificar cuándo necesitas descansar o cambiar de estrategia?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta sencillo reconocer tus límites personales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Aprendes de tus experiencias pasadas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Mantienes un buen control de tus impulsos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Eres capaz de trabajar en metas a largo plazo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reconoces cuándo una situación afecta tu bienestar emocional?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te sientes cómodo dedicando tiempo a la introspección?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Comprendes qué actividades te hacen sentir realizado?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles actuar de acuerdo con tus valores personales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te adaptas cuando descubres que una estrategia personal no funciona?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reconoces cuándo necesitas ayuda o apoyo emocional?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Consideras que te conoces profundamente como persona?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
}

];

const scores = [1,2,3,4];

let currentQuestion = 0;
let totalScore = 0;
let selectedAnswer = null;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

function loadQuestion(){

    const q = questions[currentQuestion];

    questionEl.textContent = q.question;

    answersEl.innerHTML = "";

    selectedAnswer = null;

    q.answers.forEach((answer,index)=>{

        const button = document.createElement("button");

        button.classList.add("answer-btn");

        button.textContent = answer;

        button.addEventListener("click",()=>{

            document
            .querySelectorAll(".answer-btn")
            .forEach(btn=>btn.classList.remove("selected"));

            button.classList.add("selected");

            selectedAnswer = scores[index];
        });

        answersEl.appendChild(button);
    });

    updateProgress();
}

function updateProgress(){

    const progress =
    ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = `${progress}%`;

    document.getElementById("questionCounter").textContent =
    `Pregunta ${currentQuestion + 1} de ${questions.length}`;

    document.getElementById("progressPercent").textContent =
    `${Math.round(progress)}%`;
}

nextBtn.addEventListener("click",()=>{

    if(selectedAnswer === null){
        alert("Selecciona una respuesta.");
        return;
    }

    totalScore += selectedAnswer;
    currentQuestion++;

    if(currentQuestion < questions.length){
        loadQuestion();
    }
    else{
        showResult();
    }
});

function showResult(){

    document.querySelector(".quiz-card")
    .classList.add("hidden");

    document.querySelector(".progress-wrapper")
    .classList.add("hidden");

    document.getElementById("resultContainer")
    .classList.remove("hidden");

    document.getElementById("scoreText").textContent =
    `Puntuación obtenida: ${totalScore} de 80 puntos`;

    let level = "";
    let description = "";

    if(totalScore <= 30){

        level = "Nivel Bajo";

        description =
        "Aún puedes desarrollar una mayor comprensión de tus emociones, motivaciones y objetivos personales.";
    }
    else if(totalScore <= 50){

        level = "Nivel Medio";

        description =
        "Posees un nivel moderado de autoconocimiento y reflexión personal.";
    }
    else if(totalScore <= 70){

        level = "Nivel Alto";

        description =
        "Demuestras una buena capacidad para comprender tus emociones y dirigir tu crecimiento personal.";
    }
    else{

        level = "Nivel Muy Alto";

        description =
        "Destacas por tu autoconocimiento, autorregulación emocional y claridad sobre tus metas y valores.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level} de Inteligencia Intrapersonal</strong>
        <br><br>
        ${description}
    `;
}

loadQuestion();