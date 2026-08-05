import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CustomerStatus } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any){
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

  async findAll(companyId: number) {
    return this.prisma.customer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });
  }

  async findOne(id: number, companyId: number) {
    this.validateId(id);

    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
      include: { company: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async findOneByCompany(companyId: number, id: number) {
    return this.prisma.customer.findFirst({
      where: {
        id,
        companyId,
      },
      include: { company: true },
    });
  }

  async update(id: number, dto: any, companyId: number) {
    this.validateId(id);

    const existing = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!existing) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.update({
      where: { id },
      data: this.updateData(dto),
      include: { company: true },
    });
  }

  async updateByCompany(companyId: number, id: number, dto: any) {
    this.validateId(id);

    return this.prisma.customer.update({
      where: {
  id,
  companyId,
},
      data: this.updateData(dto),
    });
  }

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

  private parseStatus(status: string): CustomerStatus {
    const value = status.toUpperCase();

    if (!CustomerStatus[value]) {
      throw new BadRequestException(
        `Invalid status. Allowed: ${Object.values(CustomerStatus).join(', ')}`,
      );
    }

    return CustomerStatus[value];
  }

  private validateId(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async remove(id: number, companyId: number) {
    this.validateId(id);

    const existing = await this.prisma.customer.findFirst({
      where: { id, companyId },
    });

    if (!existing) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async removeByCompany(companyId: number, id: number) {
    this.validateId(id);

    return this.prisma.customer.delete({
      where: {
        id,
        companyId,
      },
    });
  }
}