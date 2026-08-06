import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from '../../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
     private emailService: EmailService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ) {

    const admin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
    });


    if (!admin) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }


    if(admin.status !== 'ACTIVE'){
      throw new UnauthorizedException(
        'Account is inactive',
      );
    }


    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password,
      );


    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }


    return admin;
  }
  async login(
    email:string,
    password:string,
  ) {


    const admin = await this.validateUser(
      email,
      password,
    );


    // Plain (asal) OTP — sirf email mein bhejne ke liye, kabhi save nahi hoga
    const plainOtp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Hashed version — yehi database mein save hoga, plain text kabhi nahi
    const hashedOtp = await bcrypt.hash(plainOtp, 10);

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000, // 10 minute expiry
    );

    // Upsert: agar purana OTP entry maujood hai to overwrite,
    // warna nayi bana di jayegi — naye OTP request per purana
    // automatically replace ho jata hai
    await this.prisma.profile.upsert({
      where: {
        adminId: admin.id,
      },
      update: {
        otp: hashedOtp,
        otpExpiry,
      },
      create: {
        adminId: admin.id,
        otp: hashedOtp,
        otpExpiry,
      },
    });

    await this.emailService.sendOTP(email, plainOtp);

    return {
      message:'2FA code sent',
    };

  }
  async verify2FA(
    email:string,
    code:string,
    userAgent?: string | null,
    ip?: string | null,
  ) {

    const admin =
      await this.prisma.admin.findUnique({
        where:{
          email,
        },
      });

    if(!admin){

      throw new UnauthorizedException(
        'Admin not found',
      );

    }

    const profile = await this.prisma.profile.findUnique({
      where: {
        adminId: admin.id,
      },
    });

    if (!profile || !profile.otp || !profile.otpExpiry) {
      throw new UnauthorizedException(
        'No pending 2FA request found. Please login again.',
      );
    }

    // Expiry check pehle — agar expire ho chuka hai to seedha clean kar dein
    if (Date.now() > profile.otpExpiry.getTime()) {

      await this.prisma.profile.update({
        where: { adminId: admin.id },
        data: { otp: null, otpExpiry: null },
      });

      throw new UnauthorizedException(
        '2FA code expired',
      );
    }

    // Hashed OTP se compare — bcrypt.compare plain code ko hash se match karta hai
    const isCodeValid = await bcrypt.compare(code, profile.otp);

    if (!isCodeValid) {
      throw new UnauthorizedException(
        'Invalid 2FA code',
      );
    }

    // Verify successful — OTP ab turant database se clear kar dein
    // taake dobara wahi code use na ho sake (single-use guarantee)
    await this.prisma.profile.update({
      where: { adminId: admin.id },
      data: {
        otp: null,
        otpExpiry: null,
        lastLoginDevice: userAgent,
        lastLoginIp: ip,
      },
    });

    await this.prisma.admin.update({

      where:{
        id:admin.id,
      },

      data:{
        lastLogin:new Date(),
      },

    });




    const payload = {

      sub:admin.id,

      email:admin.email,

      role:admin.role,

      permissions:admin.permissions,

      companyId:admin.companyId,

    };




    return {
      access_token:
        this.jwtService.sign(payload),
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        companyId: admin.companyId,
        permissions: admin.permissions,

      },
    };

  }


}