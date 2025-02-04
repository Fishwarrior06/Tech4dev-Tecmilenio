
const sheetId = "1dKr_yZmorv4lxXbAtaTcp5OvU6x2vM_JQpOCFQ2tO2o"; // ID de la hoja
const apiKey = "AIzaSyANb0P0ZIFIINJdD8dEifevfeA91l3Qz6k"; // API Key de Google
const range = "A2:E100"; // Rango de la hoja

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD633", "#33FFDA", "#A633FF", "#FF8133", "#33FF8F", "#FF3333",
    "#FF8C33", "#33D8FF", "#33FF57", "#33D833", "#FF5733"
]; // Colores estáticos (15 colores)

async function fetchVotes() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values) return;

        let votes = {};

        // Inicializar los votos de todos los equipos (del 1 al 15) en 0
        for (let i = 1; i <= 15; i++) {
            votes[`Equipo ${i}`] = 0;
        }

        // Verificar que los datos de la hoja sean correctos
        console.log("Datos recibidos de la hoja:", data.values);

        // Recorrer los registros de la hoja
        data.values.slice(1).forEach((row, index) => {
            let team = row[2]; // Columna "¿Quién debe ganar según tú?"
            if (!team) return; // Si no hay un equipo en esa fila, lo ignoramos

            // Verificar qué equipo es leído y mostrar más detalles
            console.log(`Fila ${index + 1}: ${team}`);

            // Verificar que el nombre del equipo sea válido (equipo 1 a equipo 15)
            if (team.startsWith("Equipo")) {
                let teamNumber = parseInt(team.split(" ")[1]); // Obtener el número del equipo (1, 2, 3, ...)
                
                // Mapear el equipo correctamente
                if (teamNumber >= 1 && teamNumber <= 15) {
                    console.log(`Voto incrementado para: ${team}`);
                    votes[`Equipo ${teamNumber}`] = (votes[`Equipo ${teamNumber}`] || 0) + 1; // Incrementar el voto del equipo
                }
            }
        });

        console.log("Votos procesados:", votes);

        updateChart(votes); // Actualizar el gráfico con los votos
    } catch (error) {
        console.error("Error obteniendo los datos:", error);
    }
}

// Crear el gráfico
const ctx = document.getElementById('voteChart').getContext('2d');
let voteChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Votos',
            data: [],
            backgroundColor: colors, // Asignar colores estáticos a las barras
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: 'white', // Color del texto
                font: {
                    weight: 'bold',
                    size: 14
                },
                align: 'center', // Centrar las etiquetas dentro de las barras
                anchor: 'center', // Asegura que las etiquetas estén centradas en la barra
                formatter: function(value) {
                    return value; // Mostrar el número de votos dentro de la barra
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    },
    plugins: [ChartDataLabels] // Asegúrate de que el plugin esté activado
});

function updateChart(votes) {
    // Crear una lista de etiquetas con los nombres de los equipos
    const teams = Array.from({ length: 15 }, (_, index) => `Equipo ${index + 1}`);

    // Etiquetas del equipo, en el orden de 'Equipo 1', 'Equipo 2', etc.
    voteChart.data.labels = teams;

    // Asignar los votos a cada equipo (si no tiene votos, asignamos 0)
    let dataVotes = teams.map(team => votes[team] || 0);

    // Datos de votos (cantidad de votos de cada equipo)
    voteChart.data.datasets[0].data = dataVotes;

    // Asignar colores cíclicamente si hay más de 15 barras
    const repeatedColors = [];
    for (let i = 0; i < teams.length; i++) {
        repeatedColors.push(colors[i % colors.length]); // Repite los colores si es necesario
    }

    voteChart.data.datasets[0].backgroundColor = repeatedColors;

    // Actualizar el gráfico
    voteChart.update();
}

// Ejecutar la función y actualizar cada 5 segundos
fetchVotes();
setInterval(fetchVotes, 5000);