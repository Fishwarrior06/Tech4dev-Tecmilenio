// Colores estáticos (10 colores)
const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD633", 
    "#33FFDA", "#A633FF", "#FF8133", "#33FF8F", "#FF3333"
];

let previousVotes = {}; // Almacena los votos previos para evitar actualizaciones innecesarias

function isDataChanged(newVotes) {
    return JSON.stringify(previousVotes) !== JSON.stringify(newVotes);
}

async function fetchApiConfig() {
    try {
        const response = await fetch('/get-api-config');
        const data = await response.json();
        
        if (data.sheetId && data.apiKey) {
            const sheetId = data.sheetId;
            const apiKey = data.apiKey;
            const range = "A2:E100"; // Rango de la hoja
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

            fetchVotes(url); // Llamamos a la función fetchVotes pasando la URL construida
        }
    } catch (error) {
        console.error("Error obteniendo configuración de la API:", error);
    }
}

async function fetchVotes(url) {
    try {
        const response = await fetch(url);
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
            x: { beginAtZero: true },
            y: { beginAtZero: true }
        }
    },
    plugins: [ChartDataLabels]
});

function updateChart(votes) {
    let teams = Object.keys(votes);
    voteChart.data.labels = teams;
    voteChart.data.datasets[0].data = teams.map(team => votes[team] || 0);
    voteChart.update();
}

// Inicializa la petición de configuración y luego obtiene los votos
fetchApiConfig();

// Actualiza los votos cada 5 segundos
setInterval(() => fetchApiConfig(), 5000);