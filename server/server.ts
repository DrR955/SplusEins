import App from './App';

const host = process.env.HOST || '127.0.0.1';
const port = parseInt(process.env.PORT) || 3001;
const path = process.env.API_PREFIX;

const app = new App(path).app;
const server = app.listen(port, host, () => {
  console.log(`listening on host ${host} and port ${port}`)
});

const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`\nReceived ${signal}, shutting down...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed');
    process.exit(0);
  });
  // Fallback: force-exit if close hangs
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.warn('Force exit after timeout');
    process.exit(1);
  }, 5000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
