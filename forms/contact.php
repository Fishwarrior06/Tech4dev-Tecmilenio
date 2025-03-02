<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los valores del formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Configuración del correo
    $to = "tu-correo@dominio.com";  // Cambia esto por tu correo
    $subject = "Nuevo mensaje de $subject";
    $message = "Nombre: $name\nCorreo: $email\nMensaje: $message";
    $headers = "From: $email";

    // Enviar el correo
    if (mail($to, $subject, $message, $headers)) {
        echo "Mensaje enviado correctamente!";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
} else {
    echo "Método no permitido.";
}
?>