const fastify = require('fastify')({
    logger: true,
});

const PORT = 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();