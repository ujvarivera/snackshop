const fastify = require('fastify')({
    logger: true,
});
const db = require('./db');

const PORT = 3000;

fastify.get('/api/products', (req, res) => {    
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    res.send(products);
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();