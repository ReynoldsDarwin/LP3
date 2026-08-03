const questions = [

{
question:"¿Reconoces fácilmente cuando una canción está desafinada?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta sencillo seguir el ritmo de una canción con palmas o golpes?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles recordar melodías después de escucharlas pocas veces?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Identificas diferentes instrumentos musicales al escucharlos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas cantar aunque no seas profesional?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿La música influye significativamente en tu estado de ánimo?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes detectar cambios de ritmo o velocidad en una canción?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta aprender letras de canciones?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles tararear canciones durante el día?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes distinguir fácilmente géneros musicales diferentes?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te interesa aprender a tocar instrumentos musicales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Percibes detalles musicales que otras personas no notan?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te resulta fácil seguir el compás de una canción?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Relacionas recuerdos o emociones con determinadas melodías?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes reconocer una canción con solo escuchar unos segundos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta crear ritmos golpeando objetos o superficies?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Aprendes canciones más rápido que otras personas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles prestar atención a los arreglos musicales de una canción?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas asistir a conciertos o eventos musicales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Consideras que la música es una parte importante de tu vida diaria?",
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
        description = "La música no suele ser tu principal forma de procesar o expresar información.";
    }
    else if(totalScore <= 50){

        level = "Nivel Medio";
        description = "Presentas una sensibilidad musical moderada y disfrutas algunos aspectos de la música.";
    }
    else if(totalScore <= 70){

        level = "Nivel Alto";
        description = "Posees una buena percepción de ritmos, melodías y elementos musicales.";
    }
    else{

        level = "Nivel Muy Alto";
        description = "Destacas notablemente en la percepción, apreciación y comprensión de la música.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level} de Inteligencia Musical</strong>
        <br><br>
        ${description}
    `;
}

loadQuestion();