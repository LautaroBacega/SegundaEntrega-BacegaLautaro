import { Router } from 'express';
import ProductManager from '../managers/products.manager.js';
import { __dirname } from '../utils/path.js';

const router = Router();
const productManager = new ProductManager(`${__dirname}/db/products.json`);

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeproducts');
});

export default router;
