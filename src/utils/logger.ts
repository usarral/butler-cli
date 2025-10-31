import pino from 'pino';

// Configuración de Pino con Pretty Print para desarrollo
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{msg}',
      customColors: 'info:blue,warn:yellow,error:red',
    },
  },
});

export { logger };
