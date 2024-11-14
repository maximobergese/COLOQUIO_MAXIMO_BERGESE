const db = require('../database/conexion.js');

class PedidoModel {
    // Crear un nuevo pedido
    static crearPedido(idCliente, fecha, precioFinal) {
        const query = 'INSERT INTO pedido (idCliente, fecha, precioFinal) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [idCliente, fecha, precioFinal], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Obtener un pedido por ID
    static obtenerPedidoPorId(idPedido) {
        const query = 'SELECT * FROM pedido WHERE idPedido = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [idPedido], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Obtener todos los pedidos con nombre del cliente
    static obtenerTodosLosPedidos() {
        const query = `
            SELECT p.idPedido, p.fecha, p.precioFinal, c.nombre AS cliente 
            FROM pedido p 
            JOIN cliente c ON p.idCliente = c.idCliente
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = PedidoModel;
