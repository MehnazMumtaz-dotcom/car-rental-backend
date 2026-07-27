import { Module } from '@nestjs/common';

import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { ComplaintsScheduler } from './scheduler/complaints.scheduler';

import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from 'src/notifications/notification.module';
@Module({
  imports: [
    AuthModule,
    NotificationModule,
  ],

  controllers: [
    ComplaintsController,
  ],

  providers: [
    ComplaintsService,
    ComplaintsScheduler,
    PrismaService,
  ],
})
export class ComplaintsModule {}