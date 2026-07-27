import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: any) {
    return this.prisma.company.create({
      data: {
        name: dto.name.trim(),
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, dto: any) {
    return this.prisma.company.update({
      where: {
        id,
      },
      data: {
        name: dto.name.trim(),
      },
    });
  }

  async patch(id: number, dto: any) {
    return this.prisma.company.update({
      where: {
        id,
      },
      data: {
        ...(dto.name && {
          name: dto.name.trim(),
        }),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.company.delete({
      where: {
        id,
      },
    });
  }

}