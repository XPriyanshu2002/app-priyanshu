const app = require('./app');
const env = require('./config/env');

const MAX_PORT_RETRIES = 10;

const startServer = (port, retries = 0) => {
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Best Infra backend listening on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && retries < MAX_PORT_RETRIES) {
      const fallbackPort = port + 1;
      // eslint-disable-next-line no-console
      console.warn(`Port ${port} is in use. Retrying on port ${fallbackPort}...`);
      startServer(fallbackPort, retries + 1);
      return;
    }

    // eslint-disable-next-line no-console
    console.error('Backend failed to start:', error.message);
    process.exit(1);
  });
};

startServer(env.port);
