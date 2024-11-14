const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientesRoutes'); 
const pedidoRoutes = require('./routes/pedidoRoutes');
const productoRoutes = require('./routes/productoRoutes'); 
const productoPedidoRoutes = require('./routes/productoPedidoRoutes');

const app = express();
const PORT = process.env.PORT || 6500;

app.use(cors());
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON
app.use('/api/clientes', clientesRoutes); // Rutas de clientes
app.use('/api/pedidos', pedidoRoutes); // Rutas de pedidos
app.use('/api/productos', productoRoutes); // Rutas de productos
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productopedidos', productoPedidoRoutes); // Rutas de productoPedido
app.use('/api/productopedidos', productoPedidoRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
