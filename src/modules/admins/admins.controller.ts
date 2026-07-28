import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AdminService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';


@Controller('admin')
export class AdminController {


  constructor(
    private service: AdminService,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Post()
  create(
    @Body() dto: CreateAdminDto,
    @Request() req,
  ) {

    return this.service.create(
      dto,
      req.user,
    );

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  findAll(
    @Request() req,
  ) {

    return this.service.findAll(
      req.user.companyId,
    );

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req,
  ) {

    return this.service.findOne(
      Number(id),
      req.user.companyId,
    );

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Put(':id')
  updateFull(
    @Param('id') id:string,
    @Body() dto:UpdateAdminDto,
    @Request() req,
  ) {

    return this.service.update(
      Number(id),
      dto,
      req.user,
    );

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id:string,
    @Body() dto:UpdateAdminDto,
    @Request() req,
  ) {

    return this.service.update(
      Number(id),
      dto,
      req.user,
    );

  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(
    @Param('id') id:string,
    @Request() req,
  ) {

    return this.service.remove(
      Number(id),
      req.user,
    );

  }


}