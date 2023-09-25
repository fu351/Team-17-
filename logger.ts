import { createLogger, transports, format } from 'winston';

const { combine, label, timestamp, printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const createCustomLogger = (labelStr: string, level: string) =>
  createLogger({
    level: level || 'info',  // Set the specified level or default to 'info'
    format: combine(
      label({ label: labelStr }),
      timestamp(),
      customFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: process.env.LOG_FILE,
      }),
    ],
  });

const infoLogger = createCustomLogger('INFO', 'info');
const debugLogger = createCustomLogger('DEBUG', 'debug');

export { infoLogger, debugLogger };



