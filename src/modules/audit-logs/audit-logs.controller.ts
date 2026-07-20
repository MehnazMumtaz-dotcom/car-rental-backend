import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';



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