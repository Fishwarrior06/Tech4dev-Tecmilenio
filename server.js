// Cargar las variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

// Usar el puerto desde .env, con un valor por defecto de 3000
const port = process.env.PORT || 3000;

// Servir archivos estáticos (CSS, JS, imágenes)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname))); // Esto sirve todo desde la raíz del proyecto

// Rutas para los archivos HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});
app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/formulario.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'formulario.html'));
});
app.get('/portfolio.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio.html'));
});
app.get('/team.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'team.html'));
});

// Rutas para las páginas de Blogs y Argumentos
app.get('/Blogs/:blog', (req, res) => {
  const blogName = req.params.blog;
  res.sendFile(path.join(__dirname, 'Blogs', `${blogName}.html`));
});

app.get('/Argumentos/:argumento', (req, res) => {
  const argumentoName = req.params.argumento;
  res.sendFile(path.join(__dirname, 'Argumentos', `${argumentoName}.html`));
});

// Ruta para obtener las configuraciones de la API desde el backend
app.get('/get-api-config', (req, res) => {
  res.json({
    sheetId: process.env.SHEET_ID,
    apiKey: process.env.API_KEY
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});