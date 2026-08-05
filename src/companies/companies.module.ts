import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaModule } from '../database/prisma.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    CompaniesController,
  ],

  providers: [
    CompaniesService,
  ],
})
export class CompaniesModule {}