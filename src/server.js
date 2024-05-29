import express from 'express';
import { __dirname } from '../src/path.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/products.manager.js';

const app = express();
const productManager = new ProductManager(`${__dirname}/db/products.json`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', viewsRouter);

const httpServer = app.listen(8080, () => {
    console.log('🚀 Server listening on port 8080');
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
    console.log('¡NEW CONNECTION!', socket.id);

    socket.emit('products', await productManager.getProducts());
    
    // Crear producto
    socket.on('newProduct', async (product) => {
        await productManager.createProduct(product);
        socketServer.emit('products', await productManager.getProducts());
    });

    // Eliminar producto
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        socketServer.emit('products', await productManager.getProducts());
    });
});
