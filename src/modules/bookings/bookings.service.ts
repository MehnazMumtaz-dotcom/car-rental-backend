import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateBookingDto, BookingSource } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  normalizeDate(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private parseBookingDate(date: string) {
    return new Date(`${date.slice(0, 10)}T00:00:00`);
  }

  async checkClash(
    vehicleId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ) {
    if (!vehicleId) return null;

    return this.prisma.booking.findFirst({
      where: {
        vehicleId,
        status: {
          equals: 'ACTIVE',
        },
        ...(excludeId && {
          NOT: { id: excludeId },
        }),
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });
  }

  private resolveBookingSource(source?: BookingSource, customerId?: number) {
    if (source) {
      return source;
    }

    return customerId ? BookingSource.ONLINE : BookingSource.WALK_IN;
  }

  private async resolveCustomerAssignment(
    bookingSource: BookingSource,
    customerId: number | null | undefined,
    customerName: string | null | undefined,
    phone: string | null | undefined,
    companyId: number,
  ) {
    if (bookingSource === BookingSource.ONLINE) {
      if (!customerId) {
        throw new BadRequestException('Customer ID is required');
      }

      return customerId;
    }

    if (!customerName?.trim() || !phone?.trim()) {
      throw new BadRequestException(
        'A name and phone number are required for walk-in customers',
      );
    }

    const existingCustomer = await this.prisma.customer.findFirst({
      where: { phone: phone.trim() },
    });

    if (existingCustomer) {
      return existingCustomer.id;
    }

    const newCustomer = await this.prisma.customer.create({
      data: {
        name: customerName.trim(),
        phone: phone.trim(),
        companyId,
      },
    });

    return newCustomer.id;
  }

  async create(createBookingDto: CreateBookingDto) {
    const {
      forceOverride,
      source,
      customerId,
      customerName,
      phone,
      vehicleId,
      totalPrice,
      ...rest
    } = createBookingDto;

    if (!vehicleId) {
      throw new BadRequestException('Vehicle ID is required');
    }

    const startDate = this.normalizeDate(
      this.parseBookingDate(createBookingDto.startDate),
    );
    const endDate = this.normalizeDate(
      this.parseBookingDate(createBookingDto.endDate),
    );

    if (startDate > endDate) {
      throw new BadRequestException(
        'End date must be on or after start date',
      );
    }

    const clash = await this.checkClash(vehicleId, startDate, endDate);

    if (clash && !forceOverride) {
      throw new BadRequestException({
        message: 'Vehicle already booked for selected dates',
        conflictBooking: clash,
      });
    }

    const bookingSource = this.resolveBookingSource(source, customerId);
    const finalCustomerId = await this.resolveCustomerAssignment(
      bookingSource,
      customerId ?? null,
      customerName,
      phone,
      createBookingDto.companyId,
    );

    return this.prisma.booking.create({
      data: {
        ...rest,
        vehicleId,
        customerId: finalCustomerId,
        customerName: customerName?.trim() || null,
        phone: phone?.trim() || null,
        startDate,
        endDate,
        totalPrice: totalPrice ?? rest.dailyRate,
        isOverride: forceOverride ?? false,
        source: bookingSource,
      },
      include: {
        vehicle: true,
        customer: true,
        company: true,
      },
    });
  }

  async createOverride(createBookingDto: CreateBookingDto) {
    return this.create({
      ...createBookingDto,
      forceOverride: true,
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
        customer: true,
        company: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        customer: true,
        company: true,
      },
    });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const {
      forceOverride,
      vehicleId,
      customerId,
      customerName,
      phone,
      source,
      ...rest
    } = updateBookingDto;

    const existing = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new BadRequestException('Booking not found');
    }

    const startDate = updateBookingDto.startDate
      ? this.normalizeDate(this.parseBookingDate(updateBookingDto.startDate))
      : existing.startDate;

    const endDate = updateBookingDto.endDate
      ? this.normalizeDate(this.parseBookingDate(updateBookingDto.endDate))
      : existing.endDate;

    if (startDate > endDate) {
      throw new BadRequestException(
        'End date must be on or after start date',
      );
    }

    const finalVehicleId = vehicleId ?? existing.vehicleId;

    if (!finalVehicleId) {
      throw new BadRequestException('Vehicle required');
    }

    const clash = await this.checkClash(finalVehicleId, startDate, endDate, id);

    if (clash && !forceOverride) {
      throw new BadRequestException({
        message: 'Vehicle already booked for selected dates',
        conflictBooking: clash,
      });
    }

    const bookingSource = this.resolveBookingSource(
      source,
      customerId ?? (existing.customerId ? existing.customerId : undefined),
    );

    const finalCustomerId = await this.resolveCustomerAssignment(
      bookingSource,
      customerId ?? existing.customerId ?? null,
      customerName ?? existing.customerName,
      phone ?? existing.phone,
      existing.companyId,
    );

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...rest,
        vehicleId: finalVehicleId,
        customerId: finalCustomerId,
        customerName: customerName?.trim() || existing.customerName,
        phone: phone?.trim() || existing.phone,
        startDate,
        endDate,
        source: bookingSource,
        isOverride: forceOverride ?? existing.isOverride,
      },
      include: {
        vehicle: true,
        customer: true,
        company: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
