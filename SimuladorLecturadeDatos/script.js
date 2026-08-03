// =====================================
// DATOS SIMULADOS DE TEMPERATURA - PUNO
// =====================================

const temperaturas = [

    {dia:1, fecha:"01/07/2026", temp:7.5, estado:"Muy frío"},
    {dia:2, fecha:"02/07/2026", temp:8.2, estado:"Frío"},
    {dia:3, fecha:"03/07/2026", temp:6.8, estado:"Muy frío"},
    {dia:4, fecha:"04/07/2026", temp:9.1, estado:"Frío"},
    {dia:5, fecha:"05/07/2026", temp:10.3, estado:"Fresco"},
    {dia:6, fecha:"06/07/2026", temp:8.7, estado:"Frío"},
    {dia:7, fecha:"07/07/2026", temp:7.2, estado:"Frío"},
    {dia:8, fecha:"08/07/2026", temp:6.4, estado:"Muy frío"},
    {dia:9, fecha:"09/07/2026", temp:9.5, estado:"Frío"},
    {dia:10, fecha:"10/07/2026", temp:11.2, estado:"Fresco"},
    {dia:11, fecha:"11/07/2026", temp:8.9, estado:"Frío"},
    {dia:12, fecha:"12/07/2026", temp:7.8, estado:"Frío"},
    {dia:13, fecha:"13/07/2026", temp:6.5, estado:"Muy frío"},
    {dia:14, fecha:"14/07/2026", temp:8.1, estado:"Frío"},
    {dia:15, fecha:"15/07/2026", temp:9.4, estado:"Frío"},
    {dia:16, fecha:"16/07/2026", temp:10.1, estado:"Fresco"},
    {dia:17, fecha:"17/07/2026", temp:8.3, estado:"Frío"},
    {dia:18, fecha:"18/07/2026", temp:7.0, estado:"Frío"},
    {dia:19, fecha:"19/07/2026", temp:6.2, estado:"Muy frío"},
    {dia:20, fecha:"20/07/2026", temp:8.8, estado:"Frío"},
    {dia:21, fecha:"21/07/2026", temp:9.6, estado:"Frío"},
    {dia:22, fecha:"22/07/2026", temp:10.8, estado:"Fresco"},
    {dia:23, fecha:"23/07/2026", temp:9.3, estado:"Frío"},
    {dia:24, fecha:"24/07/2026", temp:8.4, estado:"Frío"},
    {dia:25, fecha:"25/07/2026", temp:7.1, estado:"Frío"},
    {dia:26, fecha:"26/07/2026", temp:6.6, estado:"Muy frío"},
    {dia:27, fecha:"27/07/2026", temp:8.9, estado:"Frío"},
    {dia:28, fecha:"28/07/2026", temp:10.5, estado:"Fresco"},
    {dia:29, fecha:"29/07/2026", temp:9.7, estado:"Frío"},
    {dia:30, fecha:"30/07/2026", temp:8.0, estado:"Frío"}

];


// =====================================
// CREAR TABLA
// =====================================

const tabla = document.getElementById("datos");


temperaturas.forEach(dato => {

    tabla.innerHTML += `

        <tr>

            <td>${dato.dia}</td>

            <td>${dato.fecha}</td>

            <td>${dato.temp} °C</td>

            <td>${dato.estado}</td>

        </tr>

    `;

});



// =====================================
// CALCULOS ESTADISTICOS
// =====================================

const valores = temperaturas.map(d => d.temp);


const promedio = (
    valores.reduce((a,b)=>a+b,0) / valores.length
).toFixed(1);


const maxima = Math.max(...valores);

const minima = Math.min(...valores);



document.getElementById("promedio").innerHTML =
    promedio + " °C";


document.getElementById("maxima").innerHTML =
    maxima + " °C";


document.getElementById("minima").innerHTML =
    minima + " °C";


document.getElementById("cantidad").innerHTML =
    temperaturas.length;



// =====================================
// PREPARAR DATOS PARA GRAFICOS
// =====================================

const dias = temperaturas.map(d=>d.dia);


// Estados climáticos

let frio = 0;
let muyFrio = 0;
let fresco = 0;


temperaturas.forEach(d=>{


    if(d.estado==="Frío"){

        frio++;

    }


    if(d.estado==="Muy frío"){

        muyFrio++;

    }


    if(d.estado==="Fresco"){

        fresco++;

    }


});



// =====================================
// GRAFICO DE LINEA
// =====================================


new Chart(
    document.getElementById("graficoLinea"),
{

    type:"line",

    data:{

        labels:dias,

        datasets:[{

            label:"Temperatura °C",

            data:valores,

            borderColor:"#1565c0",

            backgroundColor:"rgba(21,101,192,0.2)",

            fill:true,

            tension:0.3

        }]

    },


    options:{

        responsive:true,

        maintainAspectRatio:false

    }

});



// =====================================
// GRAFICO DE BARRAS
// =====================================


new Chart(
    document.getElementById("graficoBarras"),
{

    type:"bar",

    data:{

        labels:dias,

        datasets:[{

            label:"Temperatura",

            data:valores,

            backgroundColor:"#42a5f5"

        }]

    },


    options:{

        responsive:true,

        maintainAspectRatio:false

    }

});



// =====================================
// GRAFICO CIRCULAR
// =====================================


new Chart(
    document.getElementById("graficoCircular"),
{

    type:"doughnut",

    data:{

        labels:[

            "Muy frío",
            "Frío",
            "Fresco"

        ],


        datasets:[{

            data:[

                muyFrio,
                frio,
                fresco

            ],


            backgroundColor:[

                "#0d47a1",
                "#42a5f5",
                "#ffb300"

            ]

        }]

    },


    options:{

        responsive:true,

        maintainAspectRatio:false

    }

});