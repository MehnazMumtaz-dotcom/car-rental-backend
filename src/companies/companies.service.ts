import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
  ) {}


  // CREATE COMPANY (POST)
  async create(dto: any) {
    return this.prisma.company.create({
      data: {
        name: dto.name.trim(),
      },
    });
  }


  // GET ALL COMPANIES (GET)
  async findAll() {
    return this.prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


  // GET SINGLE COMPANY (GET BY ID)
  async findOne(id: number) {
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }


  // UPDATE COMPANY (PUT)
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


  // PARTIAL UPDATE COMPANY (PATCH)
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


  // DELETE COMPANY (DELETE)
  async remove(id: number) {
    return this.prisma.company.delete({
      where: {
        id,
      },
    });
  }

}