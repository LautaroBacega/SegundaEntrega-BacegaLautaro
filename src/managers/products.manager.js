import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async createProduct(product) {
        const products = await this.getProducts();
        product.id = uuidv4();
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    }
}
