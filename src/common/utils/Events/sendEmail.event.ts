import { EventEmitter } from 'node:events';
import { sendEmail } from '../Email/sendEmail.utils';
import Mail from 'nodemailer/lib/mailer';
import { SubjectEnum } from '../../enums/user.eums';
import { template } from '../Email/verifyEmail.template.utils';

export const eventEmitter = new EventEmitter();

export interface IEmail extends Mail.Options {
  code: number;
  firstName: string;
}

eventEmitter.on('confirm_email', async (data: IEmail) => {
  try {
    data.subject = SubjectEnum.CONFIRM_EMAIL;
    data.html = template(data.code, data.firstName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log('Failed To Send Confirm Email', error);
  }
});
