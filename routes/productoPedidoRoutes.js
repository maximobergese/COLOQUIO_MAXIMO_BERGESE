const express = require('express');
const router = express.Router();
const db = require('../database/conexion');

// Endpoint para crear productos asociados a un pedido
router.post('/', (req, res) => {
    const { idPedido, idProducto, cantidad, precioUnitario } = req.body;
    console.log("hola", idProducto);

    // Validar que todos los datos estén presentes
    if (!idPedido || !idProducto || !cantidad || !precioUnitario) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Consulta para insertar el nuevo productoPedido
    const query = "INSERT INTO productoPedido (idPedido, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)";
    db.query(query, [idPedido, idProducto, cantidad, precioUnitario], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al crear el producto del pedido" });
        }
        res.status(201).json({ message: "Producto del pedido creado", idProductoPedido: result.insertId });
    });
});

// Si necesitas un GET para obtener productos pedidos
router.get('/', (req, res) => {
    const query = "SELECT * FROM productoPedido";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener los productos del pedido' });
        }
        res.json(results);
    });
});

module.exports = router;
