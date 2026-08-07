import { BadRequestException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const sendEmail = async (data: Mail.Options) => {
  if (!(data.html && data.subject)) {
    throw new BadRequestException('The Data Is Incomplete');
  }

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = transporter.sendMail({
    ...data,
    from: `"E-commerce App" <${(process.env.EMAIL_USER = '')}>`,
  });

  console.log('Message Sent :', (await info).messageId);
};
