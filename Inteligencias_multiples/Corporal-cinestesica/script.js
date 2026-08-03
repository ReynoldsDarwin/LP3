const questions = [

{
question:"¿Aprendes mejor cuando realizas una actividad práctica en lugar de solo leer o escuchar?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta fácil coordinar movimientos físicos complejos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas practicar deportes o actividades físicas regularmente?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Utilizas gestos o movimientos corporales al comunicarte?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Aprendes nuevas habilidades físicas con rapidez?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta construir, reparar o manipular objetos con las manos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Mantienes buen equilibrio y coordinación corporal?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas actividades como baile, gimnasia o artes marciales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Prefieres experimentar algo por ti mismo antes que observar a otros hacerlo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles destacar en actividades que requieren destreza manual?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta sencillo imitar movimientos que observas en otras personas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Utilizas el movimiento para expresar emociones o ideas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te sientes incómodo permaneciendo inmóvil durante mucho tiempo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Aprendes mejor mediante demostraciones prácticas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te consideras una persona hábil con herramientas o equipos físicos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Tienes buena precisión al lanzar, atrapar o manipular objetos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas retos que impliquen coordinación entre mente y cuerpo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes recordar movimientos o secuencias físicas con facilidad?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles aprender más rápido cuando participas activamente en una actividad?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Consideras que el movimiento y la acción son importantes en tu forma de aprender?",
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
    }else{
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
        "Prefieres aprender y expresarte mediante otros tipos de inteligencia más que mediante la acción física.";
    }
    else if(totalScore <= 50){

        level = "Nivel Medio";
        description =
        "Presentas habilidades corporales moderadas y disfrutas algunas actividades prácticas y físicas.";
    }
    else if(totalScore <= 70){

        level = "Nivel Alto";
        description =
        "Posees una buena coordinación corporal y facilidad para aprender mediante la experiencia práctica.";
    }
    else{

        level = "Nivel Muy Alto";
        description =
        "Destacas en el control corporal, la coordinación, la destreza física y el aprendizaje a través del movimiento.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level} de Inteligencia Corporal-Cinestésica</strong>
        <br><br>
        ${description}
    `;
}

loadQuestion();