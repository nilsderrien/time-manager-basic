import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Time Manager API',
    version: '1.0.0',
    description: 'API du projet Time Manager.',
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./src/**/*.ts', './dist/**/*.js'],
});
