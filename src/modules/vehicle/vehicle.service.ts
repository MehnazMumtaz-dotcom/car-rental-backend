import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}


  // Create Vehicle
  async create(data: any) {
    return await this.prisma.vehicle.create({
      data: {
        name: data.name,
        model: data.model,
        numberPlate: data.numberPlate,
        dailyRate: data.dailyRate,
      },
    });
  }


  // Get All Vehicles
  async findAll() {
    return await this.prisma.vehicle.findMany();
  }


  // Get Single Vehicle
  async findOne(id: number) {
    return await this.prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  }


  // Update Vehicle
  async update(id: number, data: any) {
    return await this.prisma.vehicle.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        model: data.model,
        numberPlate: data.numberPlate,
        dailyRate: data.dailyRate,
      },
    });
  }


  // Delete Vehicle
  async delete(id: number) {
    return await this.prisma.vehicle.delete({
      where: {
        id,
      },
    });
  }
}