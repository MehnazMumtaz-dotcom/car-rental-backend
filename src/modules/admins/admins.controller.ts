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

import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('admin')
export class AdminController {


  constructor(
    private service: AdminService,
  ) {}



  // ✅ CREATE ADMIN
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




  // ✅ GET ALL ADMINS
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {

    return this.service.findAll();

  }




  // ✅ GET ONE ADMIN
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(
    @Param('id') id:string,
  ) {

    return this.service.findOne(
      Number(id),
    );

  }





  // ✅ FULL UPDATE
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





  // ✅ PATCH UPDATE
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





  // ✅ DELETE ADMIN
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