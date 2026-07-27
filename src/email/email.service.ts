import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mehnaz529477@gmail.com',
      pass: 'zqzlnyypaiikjrsh',
    },
  });

  async sendOTP(email: string, code: string) {
    await this.transporter.sendMail({
      from: '"Admin Panel" <YOUR_EMAIL@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <h2>Login Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  }
}