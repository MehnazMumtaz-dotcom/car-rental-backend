import { Module } from '@nestjs/common';

import { AdminController } from './admins.controller';
import { AdminService } from './admins.service';

import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AuditLogsModule, // ✅ ADD
  ],

  controllers: [
    AdminController,
  ],

  providers: [
    AdminService,
  ],
})
export class AdminModule {}