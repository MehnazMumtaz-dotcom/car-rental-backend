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
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('config')
@UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
@RequirePermission('configPanel')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @Roles('ADMIN')
  createConfig(@Body() body: any) {
    return this.configService.createConfig(body);
  }
  @Get(':companyId')
  @Roles('ADMIN')
  getConfig(@Param('companyId') companyId: string) {
    return this.configService.getConfig(Number(companyId));
  }

  @Get()
  @Roles('ADMIN')
  getAllConfigs() {
    return this.configService.getAllConfigs();
  }

  @Put(':companyId')
  @Roles('ADMIN')
  updateConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
  ) {
    return this.configService.updateConfig(Number(companyId), body);
  }

  @Patch(':companyId')
  @Roles('ADMIN')
  patchConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
  ) {
    return this.configService.patchConfig(Number(companyId), body);
  }

  @Delete(':companyId')
  @Roles('ADMIN')
  deleteConfig(@Param('companyId') companyId: string) {
    return this.configService.deleteConfig(Number(companyId));
  }
}