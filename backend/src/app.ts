import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { healthController } from './controllers/health.controller.js';
import { loginController } from './controllers/login.controller.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // TODO: Add an automated check that every exposed route is documented.
  app.use(healthController);
  app.use(loginController);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
