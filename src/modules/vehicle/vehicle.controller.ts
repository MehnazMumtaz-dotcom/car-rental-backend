import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';

import { VehicleService } from './vehicle.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('vehicles')
@UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
@RequirePermission('bookingCalendar')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() body: any) {
    return this.vehicleService.create(body);
  }

  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUB_ADMIN')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }

  @Put(':id')
  @Roles('ADMIN')
  replace(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.vehicleService.delete(Number(id));
  }
}