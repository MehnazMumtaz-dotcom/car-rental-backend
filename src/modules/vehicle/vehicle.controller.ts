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

  @Post()
  create(@Body() body: any) {
    return this.vehicleService.create(body);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }

  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.vehicleService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vehicleService.delete(Number(id));
  }
}