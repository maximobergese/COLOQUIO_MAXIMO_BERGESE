const express = require('express');
const router = express.Router();
const db = require('../database/conexion');


// Endpoint para obtener todos los productos
router.get('/', (req, res) => {
    const query = 'SELECT * FROM producto';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        res.json(results);
    });
});

module.exports = router;
