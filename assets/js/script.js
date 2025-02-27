const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD633", 
    "#33FFDA", "#A633FF", "#FF8133", "#33FF8F", "#FF3333"
];

let previousVotes = {};

// Función para verificar si los votos han cambiado
function isDataChanged(newVotes) {
    return JSON.stringify(previousVotes) !== JSON.stringify(newVotes);
}

// Función para obtener votos desde el backend
async function fetchVotes() {
    try {
        const response = await fetch('/get-votes');
        const data = await response.json();

        if (!data || !data.values) {
            console.warn("No hay datos en la respuesta de la API.");
            return;
        }

        let votes = {};
        for (let i = 1; i <= 10; i++) {
            votes[`Equipo ${i}`] = 0;
        }

        data.values.slice(1).forEach((row) => {
            let team = row[2]; // Columna "¿Quién debe ganar según tú?"
            if (!team) return;

            let teamNumber = parseInt(team.split(" ")[1]);
            if (teamNumber >= 1 && teamNumber <= 10) {
                votes[`Equipo ${teamNumber}`] = (votes[`Equipo ${teamNumber}`] || 0) + 1;
            }
        });

        if (isDataChanged(votes)) {
            previousVotes = { ...votes };
            updateChart(votes);
        }
    } catch (error) {
        console.error("Error obteniendo los datos:", error);
    }
}

const ctx = document.getElementById('voteChart').getContext('2d');
let voteChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 10 }, (_, index) => `Equipo ${index + 1}`),
        datasets: [{
            label: 'Votos',
            data: new Array(10).fill(0),
            backgroundColor: colors,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: 'white',
                font: { weight: 'bold', size: 14 },
                align: 'center',
                anchor: 'center',
                formatter: value => value
            }
        },
        scales: {
            x: { 
                beginAtZero: true,
                display: false // Esto elimina los nombres del eje x
            },
            y: { beginAtZero: true }
        }
    },
    plugins: [ChartDataLabels]
});

// Actualizar gráfico
function updateChart(votes) {
    let teams = Object.keys(votes);
    voteChart.data.labels = teams;
    voteChart.data.datasets[0].data = teams.map(team => votes[team] || 0);
    voteChart.update();
}

// Obtener los votos y actualizar cada 5 segundos
fetchVotes();
setInterval(fetchVotes, 5000);