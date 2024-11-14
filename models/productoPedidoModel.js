const db = require('../database/conexion.js');

class ProductoPedidoModel {
    // Agregar productos a un pedido
    static agregarProducto(idPedido, nombreProducto, precioUnitario, cantidad, callback) {
        const query = `
            INSERT INTO productopedido (idPedido, nombreProducto, precioUnitario, cantidad) 
            VALUES (?, ?, ?, ?);
        `;
        db.query(query, [idPedido, nombreProducto, precioUnitario, cantidad], callback);
    }

    // Obtener productos de un pedido por ID de pedido
    static obtenerProductosPorPedido(idPedido, callback) {
        const query = 'SELECT * FROM productopedido WHERE idPedido = ?';
        db.query(query, [idPedido], callback);
    }
}

module.exports = ProductoPedidoModel;
