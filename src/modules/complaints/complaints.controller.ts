import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  DefaultValuePipe,
  BadRequestException,
  Delete,
   Req,
} from '@nestjs/common';

import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';


import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('complaints')
@UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
@RequirePermission('complaints')
export class ComplaintsController {
  constructor(
    private readonly service: ComplaintsService,
  ) {}
@Post()
@Roles('ADMIN', 'SUB_ADMIN')
create(
  @Req() req,
  @Body() body: CreateComplaintDto,
) {
  return this.service.create(
    body,
    req.user.sub,
    req.user.companyId,
  );
}


@Patch(':id/assign')
@Roles('ADMIN')
assign(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: { adminId: number },
  @Req() req,
) {
  return this.service.assignComplaint(
    id,
    body.adminId,
    req.user.companyId,
  );
}
  @Patch(':id/resolve')
  @Roles('ADMIN', 'SUB_ADMIN')
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.service.resolveComplaint(id, req.user.companyId);
  }

  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll(
     @Req() req,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
   
  ) {
    return this.service.getAll({
  status,
  priority,
  companyId: req.user.companyId, 
});
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.service.deleteComplaint(id, req.user.companyId);
  }
}