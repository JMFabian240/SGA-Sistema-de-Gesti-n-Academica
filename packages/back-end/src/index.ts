import fastify from 'fastify';
import { prisma } from '@sga/data-access';

const server = fastify();
const port = Number(process.env.TRPC_PORT) || 3000;

server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port, host: '127.0.0.1' });
    console.log(`Backend server listening on http://127.0.0.1:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
