import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './database/prisma.module';

import { CustomersModule } from './modules/customers/customers.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { AdminModule } from './modules/admins/admins.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';

import { ConfigModule as AppConfigModule } from './modules/config/config.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationModule } from './notifications/notification.module';

import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    PrismaModule,

    CustomersModule,
    CompaniesModule,
    AuthModule,
    AdminModule,
    AuditLogsModule,

    BookingsModule,
    VehicleModule,

    AppConfigModule,

    NotificationModule,
    ReportsModule,
    ComplaintsModule,
    DashboardModule,

    ProfileModule,
  ],

  controllers: [AppController],
})
export class AppModule {}