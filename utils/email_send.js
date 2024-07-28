import * as dotenv from 'dotenv'
import { SMTPClient } from 'emailjs';
import { logger } from '../utils/logger.js';

/**
 * отправляем email с заданными полями, параметры подключения загружаются из env
 * @function
 * @param {object} obj - объект с полями text, from, to, subject 
 * @return {Bool} возвращаем boolean - true - если успешно
 */
export async function sendEmail(obj) {

  dotenv.config();

  const client = new SMTPClient({
    user: process.env.EMAIL_LOGIN,
    password: process.env.EMAIL_PASS,
    host: process.env.EMAIL_SMTP,
    ssl: process.env.EMAIL_SSL === 'true',
  });

  try {
    const message = await client.sendAsync({
      text: obj.text,
      from: obj.from,
      to: obj.to,
      subject: obj.subject,
    });
    logger.info('message to ' + obj.to + ' sended');
    return true;
  } catch (error) {
    logger.error('message to ' + obj.to + ' not sended: ' + error.stack);
    console.log(error);
    return false;
  }

}