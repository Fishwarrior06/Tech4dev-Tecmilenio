const colors = [
    "#000000", "#F76b0e", "#51D1F6", "#023E8A", "#FFD633", 
    "#2E6F40", "#E0E0E0", "#FF0000", "#8806CE", "#FF3333"
];

let previousVotes = {};

function isDataChanged(newVotes) {
    return JSON.stringify(previousVotes) !== JSON.stringify(newVotes);
}

async function fetchVotes() {
    try {
        const response = await fetch('https://tech4dev-tecmilenio.vercel.app/get-votes');
        const data = await response.json();

        if (!data || !data.values) {
            console.warn("No hay datos en la respuesta de la API.");
            return;
        }

        // Inicializar todos los equipos del 1 al 10 con 0 votos
        let votes = {};
        for (let i = 1; i <= 10; i++) {
            votes[`Equipo ${i}`] = 0;
        }

        // Contar los votos reales
        data.values.slice(1).forEach((row) => {
            let team = row[2]; 
            if (!team) return;
            let teamNumber = parseInt(team.split(" ")[1]);
            if (teamNumber >= 1 && teamNumber <= 10) {
                votes[`Equipo ${teamNumber}`] += 1;
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
                "assets/img/Feria/Adrián Alonso Jair Morales Márquez - Violeta/Redes MZDG (logo).png",
                "assets/img/Feria/Angel Austrer Aguero Avila/imagen_2025-02-28_000107502.png"
            ];

            images.forEach((imageSrc, index) => {
                let image = new Image();
                image.src = imageSrc;
                image.onload = function() {
                    // Definir un tamaño por defecto de la imagen
                    let imageSize = 86;  // Tamaño predeterminado de la imagen

                    // Verificar el tamaño de la pantalla y ajustar el tamaño de la imagen
                    if (window.innerWidth <= 768) {
                        imageSize = 30;  // Tamaño más pequeño para móviles
                    }

                    // Ajustamos la posición de las imágenes para que no se mueva todo
                    let x = chart.scales.x.getPixelForValue(index) - (imageSize / 2);  // Centrar la imagen
                    let y = chart.scales.y.bottom - imageSize - 10;  // Ajusta la posición Y

                    console.log(`Dibujando imagen ${index + 1} en X: ${x}, Y: ${y}`);
                    ctx.drawImage(image, x, y, imageSize, imageSize);
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
