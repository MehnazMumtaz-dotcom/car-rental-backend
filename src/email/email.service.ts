import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendOTP(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"Admin Panel" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <h2>Login Verification</h2>
          <p>Your OTP code is:</p>
          <h1>${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }
}