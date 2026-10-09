import { Router } from 'express';

export const loginController = Router();

/**
 * @openapi
 * /login:
 *   get:
 *     summary: Retourne le point d'entrée de connexion
 *     responses:
 *       200:
 *         description: Réponse du point d'entrée de connexion
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: helloworld
 */
loginController.get('/login', (_request, response) => {
  response.send('helloworld');
});
