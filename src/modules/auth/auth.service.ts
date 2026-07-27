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
  private twoFACodes = new Map<string, { code: string; expiresAt: number }>();


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


    await this.validateUser(
      email,
      password,
    );


    const code = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();



    const expiresAt = Date.now() + 10 * 60 * 1000;

    this.twoFACodes.set(
      email,
      { code, expiresAt },
    );

      await this.emailService.sendOTP(email, code);
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


    const savedEntry =
      this.twoFACodes.get(email);


    if (
      !savedEntry ||
      savedEntry.code !== code
    ) {
      throw new UnauthorizedException(
        'Invalid 2FA code',
      );
    }

    if (Date.now() > savedEntry.expiresAt) {
      this.twoFACodes.delete(email);
      throw new UnauthorizedException(
        '2FA code expired',
      );
    }


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
    this.twoFACodes.delete(email);
    await this.prisma.admin.update({

      where:{
        id:admin.id,
      },

      data:{
        lastLogin:new Date(),
      },

    });
    await this.prisma.profile.upsert({
      where:{
        adminId: admin.id,
      },
      update:{
        lastLoginDevice: userAgent,
        lastLoginIp: ip,
      },
      create:{
        adminId: admin.id,
        lastLoginDevice: userAgent,
        lastLoginIp: ip,
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
      },
    };

  }


}