import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';

import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';



@Controller('audit-log')
export class AuditLogsController {


  constructor(
    private readonly service: AuditLogsService,
  ) {}



  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  findAll(){

    return this.service.findAll();

  }


}