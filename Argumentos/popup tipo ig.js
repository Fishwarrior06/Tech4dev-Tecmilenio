// Función para mostrar el pop-up y el fondo oscuro
function togglePopup() {
    var popup = document.querySelector('.popup');  // Seleccionamos el pop-up
    var overlay = document.querySelector('.popup-overlay');  // Seleccionamos el overlay

    // Cambiar el estilo para mostrar los elementos
    popup.style.display = "block";
    overlay.style.display = "block";
}

// Función para cerrar el pop-up y el fondo oscuro
function closePopup() {
    var popup = document.querySelector('.popup');  // Seleccionamos el pop-up
    var overlay = document.querySelector('.popup-overlay');  // Seleccionamos el overlay

    // Cambiar el estilo para ocultar los elementos
    popup.style.display = "none";
    overlay.style.display = "none";
}