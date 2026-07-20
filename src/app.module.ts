import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'; // 🔥 ADD THIS

import { PrismaModule } from './database/prisma.module';

import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { AdminModule } from './modules/admins/admins.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';

// ✅ EXISTING CONFIG MODULE
import { ConfigModule as AppConfigModule } from './modules/config/config.module';

// ✅ 🔥 ADD THIS (Complaints Module)
import { ComplaintsModule } from './modules/complaints/complaints.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔥 REQUIRED FOR CRON (SLA escalation)
    ScheduleModule.forRoot(),

    PrismaModule,

    CustomersModule,
    CompaniesModule,
    AuthModule,
    AdminModule,
    AuditLogsModule,

    BookingsModule,
    VehicleModule,

    // ✅ YOUR CONFIG MODULE
    AppConfigModule,

    // 🔥 ADD THIS LAST (order not strict but clean)
    ComplaintsModule,
  ],

  controllers: [AppController],
})
export class AppModule {}