import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';

import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('audit-log')
@UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
@RequirePermission('subAdmins')
export class AuditLogsController {

  constructor(
    private readonly service: AuditLogsService,
  ) {}

  @Roles('ADMIN', 'SUB_ADMIN')
  @Get()
  findAll(@Request() req){
    return this.service.findAll(req.user.companyId);
  }

}