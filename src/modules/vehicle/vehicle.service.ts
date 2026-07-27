import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return await this.prisma.vehicle.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  }

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
  async delete(id: number) {
    return await this.prisma.vehicle.delete({
      where: {
        id,
      },
    });
  }
}