require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Necesario para leer archivos
const app = express();

app.use(cors());
app.use(express.json());

// 1. Configurar Frontend
const rutaFrontend = path.join(__dirname, '../frontend');
app.use(express.static(rutaFrontend));

// 2. API: Endpoint para obtener los trucos (EL CEREBRO)
app.get('/api/solutions', (req, res) => {
    // Buscamos el archivo JSON que creamos antes
    const rutaData = path.join(__dirname, '../data/seed/solutions.json');
    
    fs.readFile(rutaData, 'utf8', (err, data) => {
        if (err) {
            console.error("Error leyendo datos:", err);
            // Si falla, enviamos datos de emergencia
            return res.json([{ title: "Error cargando", problem: "No se encuentra la base de datos" }]);
        }
        res.json(JSON.parse(data));
    });
});

// 3. Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});