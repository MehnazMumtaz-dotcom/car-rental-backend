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
import { AssignComplaintDto } from './dto/assign-complaint.dto';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('complaints')
@UseGuards(AuthGuard, RoleGuard)
export class ComplaintsController {
  constructor(
    private readonly service: ComplaintsService,
  ) {}

  // =========================
  // CREATE
  // =========================
@Post()
@Roles('ADMIN', 'SUB_ADMIN')
create(
  @Req() req,
  @Body() body: CreateComplaintDto,
) {
  console.log("USER FROM TOKEN:", req.user);
  return this.service.create(
    body,
    req.user.sub,
  );
}

  // =========================
  // ASSIGN
  // =========================

  @Patch(':id/assign')
  @Roles('ADMIN')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignComplaintDto,
  ) {
    // ✅ proper exception use karo
    if (!body.adminId) {
      throw new BadRequestException('adminId is required');
    }

    return this.service.assignComplaint(
      id,
      body.adminId,
    );
  }

  // =========================
  // RESOLVE
  // =========================

  @Patch(':id/resolve')
  @Roles('ADMIN', 'SUB_ADMIN')
  resolve(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.resolveComplaint(id);
  }

  // =========================
  // GET ALL + FILTERS
  // =========================

  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,

    
    // ✅ SAFE parsing
    @Query('companyId') companyId?: string,
  ) {
    return this.service.getAll({
      status,
      priority,
      companyId: companyId ? Number(companyId) : undefined,
    });
  }
    // =========================
  // DELETE COMPLAINT
  // =========================

  @Delete(':id')
  @Roles('ADMIN')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteComplaint(id);
  }
}