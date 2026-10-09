import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const app = createApp();
const server = app.listen(port, () => {
  console.info(`Backend listening on port ${port}`);
});

server.on('error', (error: Error) => {
  console.error('Unable to start the HTTP server', error);
  process.exitCode = 1;
});

function shutdown(signal: string): void {
  console.info(`${signal} received, shutting down`);

  server.close((error?: Error) => {
    if (error) {
      console.error('Unable to close the HTTP server', error);
      process.exitCode = 1;
      return;
    }

    process.exit(0);
  });
}

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
