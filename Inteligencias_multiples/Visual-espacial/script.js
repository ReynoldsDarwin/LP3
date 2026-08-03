const questions = [

{
    question:"¿Qué figura continúa la secuencia?",
    visual:["■","▲","●","?"],
    answers:["◆","●","▲","■"],
    correct:0
},

{
    question:"¿Cuál es el reflejo correcto de ◀ ?",
    visual:["◀"],
    answers:["▶","▲","▼","◆"],
    correct:0
},

{
    question:"¿Qué figura falta?",
    visual:["■","■","□","■","□","?"],
    answers:["□","■","▲","●"],
    correct:0
},

{
    question:"¿Cuál figura es diferente?",
    visual:["▲ ▲ ▲ ◆"],
    answers:["▲","▲","◆","▲"],
    correct:2
},

{
    question:"¿Qué sigue en el patrón?",
    visual:["●","●●","●●●","?"],
    answers:["●●●●","●●","●","●●●●●"],
    correct:0
},

{
    question:"¿Qué figura resulta de rotar ▲ 180°?",
    visual:["▲"],
    answers:["▼","▶","◀","◆"],
    correct:0
},

{
    question:"¿Cuál completa la serie?",
    visual:["◆","■","◆","■","?"],
    answers:["◆","■","▲","●"],
    correct:0
},

{
    question:"¿Qué símbolo sigue?",
    visual:["○","◐","●","?"],
    answers:["◉","▲","◆","■"],
    correct:0
},

{
    question:"¿Cuál es la figura simétrica de / ?",
    visual:["/"],
    answers:["\\","|","-","▲"],
    correct:0
},

{
    question:"¿Qué figura completa el patrón?",
    visual:["■","▲","■","▲","?"],
    answers:["■","●","◆","▼"],
    correct:0
}

];

let current = 0;
let score = 0;
let selected = null;

const question = document.getElementById("question");
const visualArea = document.getElementById("visualArea");
const answers = document.getElementById("answers");

function loadQuestion(){

    const q = questions[current];

    question.textContent = q.question;

    visualArea.innerHTML = "";

    q.visual.forEach(item=>{

        const span =
        document.createElement("span");

        span.textContent = item;

        visualArea.appendChild(span);
    });

    answers.innerHTML="";

    selected=null;

    q.answers.forEach((answer,index)=>{

        const btn =
        document.createElement("button");

        btn.className="answer";

        btn.textContent=answer;

        btn.onclick=()=>{

            document
            .querySelectorAll(".answer")
            .forEach(b=>b.classList.remove("selected"));

            btn.classList.add("selected");

            selected=index;
        };

        answers.appendChild(btn);
    });

    updateProgress();
}

function updateProgress(){

    const percent=
    ((current+1)/questions.length)*100;

    document.getElementById("progressBar")
    .style.width=percent+"%";

    document.getElementById("counter")
    .textContent=
    `Pregunta ${current+1} de 10`;
}

document
.getElementById("nextBtn")
.addEventListener("click",()=>{

    if(selected===null){

        alert("Selecciona una opción.");
        return;
    }

    if(selected===questions[current].correct){

        score++;
    }

    current++;

    if(current<questions.length){

        loadQuestion();
    }
    else{

        document.querySelector(".card")
        .classList.add("hidden");

        document.getElementById("result")
        .classList.remove("hidden");

        document.getElementById("score")
        .textContent=
        `Puntuación: ${score}/10`;

        let nivel;

        if(score<=3)
            nivel="Bajo";

        else if(score<=6)
            nivel="Medio";

        else if(score<=8)
            nivel="Alto";

        else
            nivel="Muy Alto";

        document.getElementById("level")
        .textContent=
        `Nivel de inteligencia visual-espacial: ${nivel}`;
    }
});

loadQuestion();