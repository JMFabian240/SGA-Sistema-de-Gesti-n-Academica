import type { FastifyPluginAsync } from 'fastify';
import { importacionesService } from './importaciones.service';

export const importacionesController: FastifyPluginAsync = async (server) => {
  server.post('/catalogo', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ ok: false, message: 'No se envió ningún archivo.' });
      }

      const buffer = await data.toBuffer();
      const result = await importacionesService.procesarImportacionCatalogo(buffer);
      
      return reply.send({ ok: true, message: result.message });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ ok: false, message: error.message });
    }
  });

  server.post('/inscripciones', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ ok: false, message: 'No se envió ningún archivo.' });
      }

      const buffer = await data.toBuffer();
      const result = await importacionesService.procesarImportacionInscripciones(buffer);
      
      return reply.send({ ok: true, message: result.message });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ ok: false, message: error.message });
    }
  });

  server.post('/pagos', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ ok: false, message: 'No se envió ningún archivo.' });
      }

      const buffer = await data.toBuffer();
      const result = await importacionesService.procesarImportacionPagos(buffer);
      
      return reply.send({ ok: true, message: result.message });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ ok: false, message: error.message });
    }
  });

  server.post('/saldos', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ ok: false, message: 'No se envió ningún archivo.' });
      }

      const buffer = await data.toBuffer();
      const result = await importacionesService.procesarImportacionSaldos(buffer);
      
      return reply.send({ ok: true, message: result.message });
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({ ok: false, message: error.message });
    }
  });
};
