import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CustomerStatus } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  private isCurrentlyActive(booking: { status: string; endDate: Date }): boolean {
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return false;
    }
    return new Date(booking.endDate) >= new Date();
  }

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
    const customers = await this.prisma.customer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        bookings: true,
      },
    });

    return customers.map(c => {
      const { bookings, ...rest } = c;

      const totalSpent = bookings.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0,
      );

      const activeBookings = bookings.filter((b) =>
        this.isCurrentlyActive(b),
      ).length;

      const lastActivity = bookings.length
        ? bookings.reduce((latest, b) =>
            b.createdAt > latest ? b.createdAt : latest,
          bookings[0].createdAt)
        : null;

      return {
        ...rest,
        bookings: bookings.length,
        spent: totalSpent,
        joined: c.createdAt,
        totalBookings: bookings.length,
        totalSpent,
        activeBookings,
        lastActivity,
      };
    });
  }

  async findOne(id: number, companyId: number) {
    this.validateId(id);

    const customer = await this.prisma.customer.findFirst({
      where: { id, companyId },
      include: {
        company: true,
        bookings: {
          include: {
            vehicle: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const { bookings, ...rest } = customer;

    const totalSpent = bookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );

    const activeBookings = bookings.filter((b) =>
      this.isCurrentlyActive(b),
    ).length;

    const now = new Date();

    const bookingsWithDisplayStatus = bookings.map((b) => {
      let displayStatus: string;

      if (b.status === 'CANCELLED') {
        displayStatus = 'Cancelled';
      } else if (b.status === 'COMPLETED') {
        displayStatus = 'Completed';
      } else if (now < new Date(b.startDate)) {
        displayStatus = 'Upcoming';
      } else if (now > new Date(b.endDate)) {
        displayStatus = 'Completed';
      } else {
        displayStatus = 'Ongoing';
      }

      return {
        id: b.id,
        vehicleName: b.vehicle?.name || 'Unknown Vehicle',
        startDate: b.startDate,
        endDate: b.endDate,
        totalPrice: b.totalPrice,
        rawStatus: b.status,
        displayStatus,
        createdAt: b.createdAt,
      };
    });

    return {
      ...rest,

      joined: customer.createdAt,

      totalBookings: bookings.length,

      totalSpent,

      activeBookings,

      lastActivity: bookings.length
        ? bookings.reduce((latest, b) =>
            b.createdAt > latest ? b.createdAt : latest,
          bookings[0].createdAt)
        : null,

      bookingsList: bookingsWithDisplayStatus,
    };
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