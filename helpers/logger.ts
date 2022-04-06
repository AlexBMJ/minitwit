import pino from 'pino';

if (!global.pino_init) {
  global.pino_init = pino(
    pino.transport({
      target: 'pino-socket',
      options: {
        address: 'logstash',
        port: 5000,
        mode: 'tcp',
      },
    })
  );
}
export default global.pino_init;
