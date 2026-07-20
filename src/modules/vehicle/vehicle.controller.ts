import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';

import { VehicleService } from './vehicle.service';

@Controller('vehicles')
export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  // Create Vehicle
  @Post()
  create(@Body() body: any) {
    return this.vehicleService.create(body);
  }


  // Get All Vehicles
  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }


  // Get Single Vehicle
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(Number(id));
  }


  // Update Vehicle (Partial Update)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }


  // Replace Vehicle (Full Update)
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }


  // Delete Vehicle
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vehicleService.delete(Number(id));
  }
}