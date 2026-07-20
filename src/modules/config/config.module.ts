import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthModule } from '../auth/auth.module'; // ✅ ADD THIS

@Module({
  imports: [
    PrismaModule,
    AuthModule, // ✅ VERY IMPORTANT
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}