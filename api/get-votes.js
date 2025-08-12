const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/A2:E100?key=${process.env.API_KEY}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error obteniendo votos:", error);
    res.status(500).json({ error: "Error obteniendo votos" });
  }
};