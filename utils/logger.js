import fs from 'fs/promises';
import pino from 'pino';

export const logger = pino({
    timestamp: () => `,"time":"${new Date().toLocaleString("ru-RU")}"`,
    base: undefined,
    transport: {
      targets: [
        {
          level: 'info',
          target: 'pino/file',
          options: { destination: 'logs/log.txt', append: true }
        },
        {
          level: 'error',
          target: 'pino/file',
          options: { destination: 'logs/error.txt', append: true }
        },
      ]
    }
  });

  export async function writeLog(name, data, append, jsoned) {

    if (jsoned) {
      data = JSON.stringify(data);
    } else {
      data = String(data);
    }
  
    if (append) {
      await fs.appendFile('logs/' + name, data + '\n');
    } else {
      fs.writeFile('logs/' + name, data);
    }
  }
  
