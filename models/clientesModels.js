const db = require('../database/conexion.js');

class clienteModel {
    // Consultar todos los clientes
    static consultar(callback) {
        db.query('SELECT * FROM cliente', callback);
    }
    // Consultar cliente por ID
    static consultarPorId(id, callback) {
        db.query('SELECT * FROM cliente WHERE idCliente = ?', [id], callback);
    }
    // Ingresar nuevo cliente
    static ingresar({ nombre, telefono, direccion, zona, localidad, dni }, callback) {
        const query = 'INSERT INTO cliente (nombre, telefono, direccion, zona, localidad, dni) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [nombre, telefono, direccion, zona, localidad, dni], callback);
    }
    // Actualizar datos
    static actualizar(id, { nombre, telefono, direccion, zona, localidad, dni }, callback) {
        const query = 'UPDATE cliente SET nombre = ?, telefono = ?, direccion = ?, zona = ?, localidad = ?, dni = ? WHERE idCliente = ?';
        db.query(query, [nombre, telefono, direccion, zona, localidad, dni, id], callback);
    }
    // Función para actualizar el estado de un cliente
    static actualizarEstado(id, estado, callback) {
        const query = 'UPDATE cliente SET estado = ? WHERE idCliente = ?';
        db.query(query, [estado, id], callback);
    }



}
module.exports = clienteModel;