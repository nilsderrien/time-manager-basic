export type AppErrorDetails = readonly unknown[];

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: AppErrorDetails,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
