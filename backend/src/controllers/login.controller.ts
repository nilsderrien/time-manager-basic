import { Router } from 'express';

export const loginController = Router();

loginController.get('/login', (_request, response) => {
  response.send('helloworld');
  
});
