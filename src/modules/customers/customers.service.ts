import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CustomerStatus } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE CUSTOMER
  // =========================
  async create(dto: any) {
    return this.prisma.customer.create({
      data: {
        name: dto.name.trim(),
        email: dto.email?.trim() || null,
        phone: dto.phone.trim(),
        company: {
          connect: {
            id: Number(dto.companyId),
          },
        },
      },
      include: { company: true },
    });
  }

  // =========================
  // GET ALL
  // =========================
  async findAll(companyId?: number) {
    return this.prisma.customer.findMany({
      where: companyId ? { companyId } : {},
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });
  }

  // =========================
  // GET ONE
  // =========================
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  // =========================
  // GET ONE BY COMPANY
  // =========================
  async findOneByCompany(companyId: number, id: number) {
    return this.prisma.customer.findFirst({
      where: {
        id,
        companyId,
      },
      include: { company: true },
    });
  }

  // =========================
  // UPDATE NORMAL
  // =========================
  async update(id: number, dto: any) {
    this.validateId(id);

    return this.prisma.customer.update({
      where: { id },
      data: this.updateData(dto),
      include: { company: true },
    });
  }

  // =========================
  // UPDATE BY COMPANY
  // =========================
  async updateByCompany(companyId: number, id: number, dto: any) {
    this.validateId(id);

    return this.prisma.customer.update({
      where: { id },
      data: this.updateData(dto),
    });
  }

  // =========================
  // COMMON UPDATE DATA
  // =========================
  private updateData(dto: any) {
    return {
      ...(dto.name && { name: dto.name.trim() }),
      ...(dto.email && { email: dto.email.trim() }),
      ...(dto.phone && { phone: dto.phone.trim() }),

      ...(dto.status && {
        status: this.parseStatus(dto.status),
      }),

      ...(dto.companyId && {
        company: {
          connect: {
            id: Number(dto.companyId),
          },
        },
      }),
    };
  }

  // =========================
  // ENUM SAFE PARSE
  // =========================
  private parseStatus(status: string): CustomerStatus {
    const value = status.toUpperCase();

    if (!CustomerStatus[value]) {
      throw new BadRequestException(
        `Invalid status. Allowed: ${Object.values(CustomerStatus).join(', ')}`,
      );
    }

    return CustomerStatus[value];
  }

  // =========================
  // VALIDATE ID
  // =========================
  private validateId(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  // =========================
  // DELETE NORMAL
  // =========================
  async remove(id: number) {
    this.validateId(id);

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  // =========================
  // DELETE BY COMPANY
  // =========================
  async removeByCompany(companyId: number, id: number) {
    this.validateId(id);

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}