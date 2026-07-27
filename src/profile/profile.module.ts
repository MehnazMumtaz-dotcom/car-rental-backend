import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../modules/auth/auth.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, EmailService],
})
export class ProfileModule {}