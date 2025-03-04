// Asegúrate de que PDF.js esté cargado y disponible
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el contenedor y la ruta del PDF desde el atributo 'data-pdf'
    const container = document.getElementById('pdf-container');
    const pdfUrl = container.getAttribute('data-pdf');
    
    console.log("Ruta del PDF:", pdfUrl);  // Verifica si la ruta es correcta

    // Limpiar cualquier contenido previo del contenedor
    container.innerHTML = '';  

    // Cargar el documento PDF usando PDF.js
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        console.log('PDF cargado con éxito');
        
        // Iterar a través de todas las páginas del PDF
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                // Obtener el tamaño del contenedor para calcular el tamaño del canvas
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // Calcular la escala para que el PDF encaje en el contenedor
                const scale = Math.min(containerWidth / page.getViewport({ scale: 1 }).width,
                                       containerHeight / page.getViewport({ scale: 1 }).height);

                // Obtener el "viewport" de la página del PDF con la escala calculada
                const viewport = page.getViewport({ scale });

                // Crear un nuevo canvas para renderizar la página
                const canvas = document.createElement('canvas');
                container.appendChild(canvas);  // Agregar el canvas al contenedor

                const context = canvas.getContext('2d');
                canvas.width = viewport.width;  // Establecer el ancho del canvas
                canvas.height = viewport.height;  // Establecer la altura del canvas

                // Configurar el contexto de renderizado
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // Renderizar la página en el canvas
                page.render(renderContext);
            });
        }
    }).catch(error => {
        console.error('Error al cargar el PDF:', error);
    });
});
