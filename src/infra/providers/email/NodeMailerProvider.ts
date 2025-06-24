import nodemailer from 'nodemailer';
import { IEmailProvider } from './IEmailProvider';

export class NodemailerProvider implements IEmailProvider {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT as string),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to: string | string[], subject: string, body: string): Promise<void> {
    console.log(`Sending email to: ${to}, subject: ${subject}, body: ${body}`);
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: body,
    });
  }
}
