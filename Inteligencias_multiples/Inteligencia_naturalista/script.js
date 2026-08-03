const questions = [

{
question:"¿Disfrutas pasar tiempo en la naturaleza?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reconoces diferentes especies de plantas o animales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te interesa aprender sobre ecosistemas y medio ambiente?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Observas detalles de la naturaleza que otras personas suelen ignorar?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta cuidar plantas, jardines o huertos?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sientes curiosidad por el comportamiento de los animales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Prefieres actividades al aire libre antes que permanecer en espacios cerrados?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te preocupan los problemas ambientales actuales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Puedes identificar cambios en el clima o en el entorno natural?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas visitar parques, reservas naturales o zonas rurales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te interesa la conservación de especies y ecosistemas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles clasificar o agrupar elementos naturales según sus características?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta aprender sobre geografía, biología o ciencias naturales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Reconoces fácilmente diferencias entre tipos de plantas o animales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Disfrutas observar fenómenos naturales como lluvias, montañas o estrellas?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te interesa comprender cómo funciona la naturaleza?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Participarías en actividades de protección ambiental?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Te gusta explorar nuevos entornos naturales?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Sueles sentir conexión con los seres vivos y el entorno natural?",
answers:["Nunca","Rara vez","Frecuentemente","Siempre"]
},
{
question:"¿Consideras importante preservar la biodiversidad del planeta?",
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
        "La naturaleza no suele ser uno de tus principales intereses o formas de aprendizaje.";
    }
    else if(totalScore <= 50){

        level = "Nivel Medio";

        description =
        "Presentas interés moderado por los seres vivos, el entorno natural y los fenómenos ambientales.";
    }
    else if(totalScore <= 70){

        level = "Nivel Alto";

        description =
        "Posees una buena capacidad para observar, comprender y valorar los elementos de la naturaleza.";
    }
    else{

        level = "Nivel Muy Alto";

        description =
        "Destacas por tu sensibilidad hacia el medio ambiente, los seres vivos y la comprensión de los sistemas naturales.";
    }

    document.getElementById("levelText").innerHTML = `
        <strong>${level} de Inteligencia Naturalista</strong>
        <br><br>
        ${description}
    `;
}

loadQuestion();