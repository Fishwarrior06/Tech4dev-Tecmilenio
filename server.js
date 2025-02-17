// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const port = process.env.PORT || 80;

// Servir archivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname)));

// Rutas para páginas HTML
const pages = ['index', 'blog', 'contact', 'formulario', 'portfolio', 'team'];
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, `${page}.html`));
  });
});

app.get('/Blogs/:blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'Blogs', `${req.params.blog}.html`));
});

app.get('/Argumentos/:argumento', (req, res) => {
  res.sendFile(path.join(__dirname, 'Argumentos', `${req.params.argumento}.html`));
});

// Ruta para obtener la configuración de la API
app.get('/get-api-config', (req, res) => {
  res.json({
    sheetId: process.env.SHEET_ID,
    apiKey: process.env.API_KEY
  });
});

// Nueva ruta para obtener los votos directamente desde el backend
app.get('/get-votes', async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/A2:E100?key=${process.env.API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error obteniendo votos:", error);
    res.status(500).json({ error: "Error obteniendo votos" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});