import express from 'express';
import { checkDatabase } from './db/pool.js';
import { loginController } from './controllers/login.controller.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';

type DatabaseCheck = () => Promise<void>;

export function createApp(databaseCheck: DatabaseCheck = checkDatabase) {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/api/health/db', async (_request, response) => {
    try {
      await databaseCheck();
      response.json({ status: 'ok', database: 'up' });
    } catch (error) {
      console.error('Database health check failed', error);
      response.status(503).json({ status: 'error', database: 'down' });
    }
  });

  app.use(loginController);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
