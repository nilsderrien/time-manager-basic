import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/app-error.js';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(new AppError('Le corps de la requête est invalide', 400, 'INVALID_REQUEST_BODY', result.error.issues));
      return;
    }

    request.body = result.data;
    next();
  };
}