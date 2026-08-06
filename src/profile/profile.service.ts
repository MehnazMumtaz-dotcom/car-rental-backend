import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}
  async getProfile(userId: number) {
    const profile = await this.prisma.profile.findUnique({
    where:{
        adminId:userId
      },

      include:{
        admin:{
          select:{
            id:true,
            name:true,
            email:true,
            role:true,
            status:true,
            lastLogin:true
          }
        }
      }

    });


    if(!profile){
      throw new BadRequestException('Profile not found');
    }


    return {
      ...profile,
      lastLoginDevice: this.parseDeviceLabel(profile.lastLoginDevice),
    };

  }
  async getAllProfiles(companyId: number){

    return this.prisma.profile.findMany({

      where: {
        admin: {
          companyId,
        },
      },

      include:{
        admin:{
          select:{
            id:true,
            name:true,
            email:true,
            role:true,
            status:true
          }
        }
      }

    });

  }
  async updateProfile(userId:number, body:any){

    const [profile] = await this.prisma.$transaction([

      this.prisma.profile.update({
        where:{
          adminId:userId
        },
        data:{
          avatar:body.avatar,
          phone:body.phone
        }
      }),

      this.prisma.admin.update({
        where:{
          id:userId
        },
        data:{
          name:body.name
        }
      })

    ]);

    return this.getProfile(userId);

  }
  async sendOtp(userId:number){

    const admin = await this.prisma.admin.findUnique({
      where:{
        id:userId
      }
    });

    if(!admin){
      throw new BadRequestException('Admin not found');
    }

    const plainOtp =
      Math.floor(
        100000 + Math.random()*900000
      ).toString();

    const hashedOtp = await bcrypt.hash(plainOtp, 10);


    await this.prisma.profile.upsert({

      where:{
        adminId:userId
      },

      update:{
        otp:hashedOtp,
        otpExpiry:new Date(
          Date.now()+5*60*1000
        )
      },


      create:{
        adminId:userId,
        otp:hashedOtp,
        otpExpiry:new Date(
          Date.now()+5*60*1000
        )
      }

    });

    await this.emailService.sendOTP(admin.email, plainOtp);

    return {
      message:'OTP sent successfully'
    };

  }
  async verifyOtp(userId:number, code:string){


    const profile =
      await this.prisma.profile.findUnique({

        where:{
          adminId:userId
        }

      });


    if(!profile || !profile.otp || !profile.otpExpiry){

      throw new BadRequestException(
        'OTP not found'
      );

    }


    if (Date.now() > profile.otpExpiry.getTime()) {

      await this.prisma.profile.update({
        where: { adminId: userId },
        data: { otp: null, otpExpiry: null },
      });

      throw new BadRequestException('OTP expired');
    }


    const isCodeValid = await bcrypt.compare(code, profile.otp);

    if(!isCodeValid){

      throw new BadRequestException(
        'Invalid OTP'
      );

    }



    await this.prisma.profile.update({

      where:{
        adminId:userId
      },

      data:{
        otp:null,
        otpExpiry:null,
        isVerified:true
      }

    });



    return {
      message:'OTP verified successfully'
    };

  }
  async changePassword(
    userId:number,
    currentPassword:string,
    newPassword:string
  ){


    const user =
      await this.prisma.admin.findUnique({

        where:{
          id:userId
        }

      });



    if(!user){

      throw new BadRequestException(
        'User not found'
      );

    }



    const match =
      await bcrypt.compare(
        currentPassword,
        user.password
      );


    if(!match){

      throw new BadRequestException(
        'Wrong current password'
      );

    }



    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );


    await this.prisma.admin.update({

      where:{
        id:userId
      },

      data:{
        password:hashed
      }

    });


    return {
      message:'Password updated successfully'
    };

  }

  async changeEmail(
    userId:number,
    email:string
  ){

    return this.prisma.admin.update({

      where:{
        id:userId
      },

      data:{
        email
      }

    });

  }
  async getSessions(userId:number){

    const profile = await this.prisma.profile.findUnique({
      where:{
        adminId:userId
      },
      include:{
        admin:{
          select:{
            lastLogin:true
          }
        }
      }
    });

    if(!profile){
      return [];
    }

    return [
      {
        id: profile.id,
        device: this.parseDeviceLabel(profile.lastLoginDevice),
        ip: profile.lastLoginIp || 'Unknown IP',
        location: null,
        lastActive: profile.admin?.lastLogin || null,
        thisDevice: true
      }
    ];

  }
  private parseDeviceLabel(userAgent?: string | null): string {

    if (!userAgent) return 'Unknown device';

    const ua = userAgent;

    let browser = 'Unknown Browser';
    if (/edg\//i.test(ua)) browser = 'Edge';
    else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua)) browser = 'Safari';

    let os = 'Unknown OS';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/mac os|macintosh/i.test(ua)) os = 'macOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    return `${browser} on ${os}`;

  }



  async revokeSession(
    userId:number,
    sessionId:number
  ){

    return {
      message:'Session revoked'
    };

  }



  async revokeAll(userId:number){

    return {
      message:'All sessions revoked'
    };

  }
  async getLogs(userId:number){
    const logs = await this.prisma.auditLog.findMany({
      where:{
        adminId:userId
      },
      orderBy:{
        createdAt:'desc'
      },
      take:20
    });

    return logs.map((log) => ({
      action: log.action,
      time: log.createdAt,
      type: this.mapEntityToLogType(log.entity),
    }));

  }

  private mapEntityToLogType(entity:string):string{

    const value = (entity || '').toLowerCase();

    if(value.includes('password')) return 'password';
    if(value.includes('email')) return 'email';
    if(value.includes('login') || value.includes('session')) return 'login';

    return 'security';

  }


}