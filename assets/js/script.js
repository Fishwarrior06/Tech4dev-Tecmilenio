const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD633", 
    "#33FFDA", "#A633FF", "#FF8133", "#33FF8F", "#FF3333"
];

let previousVotes = {};

function isDataChanged(newVotes) {
    return JSON.stringify(previousVotes) !== JSON.stringify(newVotes);
}

async function fetchVotes() {
    try {
        const response = await fetch('/get-votes');
        const data = await response.json();

        if (!data || !data.values) {
            console.warn("No hay datos en la respuesta de la API.");
            return;
        }

        let votes = {};
        data.values.slice(1).forEach((row) => {
            let team = row[2]; 
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
            borderColor: colors,
            borderWidth: 1
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
                ticks: { display: false }, 
                grid: { display: false }
            },
            y: { 
                beginAtZero: true 
            }
        },
        interaction: {
            mode: null, // Desactivamos cualquier tipo de interacción (incluyendo hover)
            intersect: false
        }
    },
    plugins: [ChartDataLabels, {
        afterDraw: function(chart) {
            const ctx = chart.ctx;
            const images = [
                "assets/img/Feria/Alejandro Roman Ramirez - negro/NetCrew logo.jpg",
                "assets/img/Feria/Alonso Renovato Esparza - Naranja/Logo.jpg",
                "assets/img/Feria/David Alejandro Siu Manjarrez - Celeste/byteway_logo_hd.png",
                "assets/img/Feria/Gamaliel Alejandro Mora Montemayor - Azul/Logo Hawkconnect.jpg",
                "assets/img/Feria/Jose Alonso Corona Contreras/Logo NetCraft.png",
                "assets/img/Feria/Nicolás Rodríguez Amarís/logo tt.jpg",
                "assets/img/Feria/Pablo Sebastián Núñez González - Blanco/Logo equipo 4.png",
                "assets/img/Feria/Santiago Sebastian Rojo Márquez - Rojo/Logo Equipo Rojo.jpg",
                "assets/img/placeholder-300x300.png",
                "assets/img/Feria/Angel Austrer Aguero Avila/imagen_2025-02-28_000107502.png"
            ];

            images.forEach((imageSrc, index) => {
                let image = new Image();
                image.src = imageSrc;
                image.onload = function() {
                    let x = chart.scales.x.getPixelForValue(index) - 45;
                    let y = chart.scales.y.bottom - 90.2;  
                    console.log(`Dibujando imagen ${index + 1} en X: ${x}, Y: ${y}`);
                    ctx.drawImage(image, x, y, 90, 90);
                };
                image.onerror = function() {
                    console.error(`Error al cargar la imagen: ${imageSrc}`);
                };
            });
        }
    }]
});

function updateChart(votes) {
    let teams = Object.keys(votes);
    voteChart.data.labels = teams;
    voteChart.data.datasets[0].data = teams.map(team => votes[team] || 0);
    voteChart.update();
}

fetchVotes();
setInterval(fetchVotes, 5000);