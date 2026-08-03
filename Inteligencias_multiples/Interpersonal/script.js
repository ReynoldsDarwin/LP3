const questions = [

{
question:"¿Te resulta fácil hacer nuevas amistades?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Comprendes cómo se sienten otras personas incluso cuando no lo expresan claramente?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Las personas suelen acudir a ti para pedir consejos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas trabajar en equipo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes identificar conflictos entre personas antes de que se agraven?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Escuchas atentamente cuando alguien te habla?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te adaptas fácilmente a diferentes grupos sociales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles mediar cuando hay desacuerdos entre otras personas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reconoces las emociones de otras personas observando sus gestos o expresiones?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta colaborar para alcanzar objetivos comunes?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te sientes cómodo hablando con personas desconocidas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes motivar a otras personas cuando están desanimadas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles comprender diferentes puntos de vista antes de emitir un juicio?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas participar en actividades grupales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Las personas te consideran alguien comprensivo y accesible?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta fácil comunicar tus ideas de forma clara?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Detectas cuando alguien necesita apoyo emocional?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta conocer personas con experiencias y perspectivas diferentes?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Eres capaz de resolver conflictos mediante el diálogo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Consideras que las relaciones humanas son una parte importante de tu vida?",
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
        "Tiendes a relacionarte de manera más reservada y aún puedes desarrollar habilidades sociales y empáticas.";
    }
    else if(totalScore <= 50){

        level = "Nivel Medio";

        description =
        "Posees habilidades sociales adecuadas y logras interactuar eficazmente en muchas situaciones.";
    }
    else if(totalScore <= 70){

        level = "Nivel Alto";

        description =
        "Demuestras una buena capacidad para comprender a los demás, comunicarte y colaborar en equipo.";
    }
    else{

        level = "Nivel Muy Alto";

        description =
        "Destacas por tu empatía, liderazgo, comunicación y habilidad para construir relaciones positivas con otras personas.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level} de Inteligencia Interpersonal</strong>
        <br><br>
        ${description}
    `;
}

loadQuestion();