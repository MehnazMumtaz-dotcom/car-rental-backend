import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module'; // ✅ ADD

@Module({
  imports: [AuthModule], // ✅ IMPORTANT
  controllers: [BookingsController],
  providers: [BookingsService, PrismaService],
})
export class BookingsModule {}