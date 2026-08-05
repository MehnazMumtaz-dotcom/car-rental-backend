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
  Req,
  ForbiddenException,
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

  private assertSameCompany(req: any, companyId: number) {
    if (req.user.companyId !== companyId) {
      throw new ForbiddenException(
        'You cannot access another company\'s config',
      );
    }
  }

  @Post()
  @Roles('ADMIN')
  createConfig(@Body() body: any, @Req() req) {
    this.assertSameCompany(req, Number(body.companyId));
    return this.configService.createConfig(body);
  }

  @Get(':companyId')
  @Roles('ADMIN')
  getConfig(@Param('companyId') companyId: string, @Req() req) {
    this.assertSameCompany(req, Number(companyId));
    return this.configService.getConfig(Number(companyId));
  }

  @Get()
  @Roles('ADMIN')
  getAllConfigs(@Req() req) {
    // Koi SUPER_ADMIN role exist nahi karta is system mein,
    // is liye ye bhi sirf apni company tak restrict hai
    return this.configService.getConfig(req.user.companyId);
  }

  @Put(':companyId')
  @Roles('ADMIN')
  updateConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
    @Req() req,
  ) {
    this.assertSameCompany(req, Number(companyId));
    return this.configService.updateConfig(Number(companyId), body);
  }

  @Patch(':companyId')
  @Roles('ADMIN')
  patchConfig(
    @Param('companyId') companyId: string,
    @Body() body: any,
    @Req() req,
  ) {
    this.assertSameCompany(req, Number(companyId));
    return this.configService.patchConfig(Number(companyId), body);
  }

  @Delete(':companyId')
  @Roles('ADMIN')
  deleteConfig(@Param('companyId') companyId: string, @Req() req) {
    this.assertSameCompany(req, Number(companyId));
    return this.configService.deleteConfig(Number(companyId));
  }
}