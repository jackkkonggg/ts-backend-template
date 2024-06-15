import pino from 'pino';
import pinoCaller from 'pino-caller';

const _logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: 'output/logs/logger.log',
        },
      },
    ],
  },
});

export const logger = _logger; // pinoCaller(_logger, { relativeTo: __dirname, stackAdjustment: 1 });
