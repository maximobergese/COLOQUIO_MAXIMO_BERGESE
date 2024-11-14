const express = require('express');
const router = express.Router();
const db = require('../database/conexion');

// Ruta para crear un nuevo pedido
router.post('/', (req, res) => {
    const { fecha, precioFinal, idCliente } = req.body;

    if (!fecha || !precioFinal || !idCliente) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const query = "INSERT INTO Pedido (fecha, precioFinal, idCliente) VALUES (?, ?, ?)";
    db.query(query, [fecha, precioFinal, idCliente], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al crear el pedido" });
        }
        res.status(201).json({ message: "Pedido creado", idPedido: result.insertId });
    });
});

// Ruta para obtener todos los pedidos
router.get('/', (req, res) => {
    const query = "SELECT * FROM Pedido";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err); 
            return res.status(500).json({ message: "Error al obtener los pedidos" });
        }
        res.status(200).json(results); 
    });
});

// Ruta para obtener detalles de un pedido por ID
router.get('/:idPedido', (req, res) => {
    const { idPedido } = req.params;

    const query = "SELECT * FROM Pedido WHERE idPedido = ?";
    db.query(query, [idPedido], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al obtener el pedido" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json(results[0]);
    });
});

// Ruta para cambiar el estado de un pedido
router.patch('/:idPedido/estado', (req, res) => {
    const { idPedido } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ message: "El estado es requerido" });
    }

    const query = "UPDATE Pedido SET estado = ? WHERE idPedido = ?";
    db.query(query, [estado, idPedido], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error al actualizar el estado del pedido" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ message: "Estado del pedido actualizado correctamente" });
    });
});


module.exports = router;
