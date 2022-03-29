import pino from 'pino';

export default pino(
  pino.transport({
    target: 'pino-socket',
    options: {
      address: 'localhost',
      port: 5000,
      mode: 'tcp',
    },
  })
);
