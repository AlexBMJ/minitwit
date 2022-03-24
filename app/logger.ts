import pino from 'pino';


export default pino(
  pino.destination({
    dest: 'log.log',
    sync: false,
    minLength: 4096,
  })
);
