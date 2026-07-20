import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ConfigService } from './config.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('config')
@UseGuards(AuthGuard, RoleGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  // 🟢 CREATE CONFIG
  @Post()
  @Roles('ADMIN')
  createConfig(@Body() body: any) {
    return this.configService.createConfig(body);
  }

  // 🟢 GET CONFIG BY COMPANY ID
  @Get(':companyId')
  @Roles('ADMIN')
  getConfig(@Param('companyId') companyId: string) {
    return this.configService.getConfig(Number(companyId));
  }

  // 🟢 GET ALL CONFIGS
  @Get()
  @Roles('ADMIN')
  getAllConfigs() {
    return this.configService.getAllConfigs();
  }

  // 🟢 FULL UPDATE (PUT)
  @Put(':companyId')
  @Roles('ADMIN')
  updateConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
  ) {
    return this.configService.updateConfig(Number(companyId), body);
  }

  // 🟡 PARTIAL UPDATE (PATCH)
  @Patch(':companyId')
  @Roles('ADMIN')
  patchConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
  ) {
    return this.configService.patchConfig(Number(companyId), body);
  }

  // 🔴 DELETE CONFIG
  @Delete(':companyId')
  @Roles('ADMIN')
  deleteConfig(@Param('companyId') companyId: string) {
    return this.configService.deleteConfig(Number(companyId));
  }
}