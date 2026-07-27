import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  BookingSource,
} from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('bookings')
@UseGuards(AuthGuard, RoleGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  resolveSource(dto: CreateBookingDto) {
    return (
      dto.source ??
      (dto.customerId
        ? BookingSource.ONLINE
        : BookingSource.WALK_IN)
    );
  }

  handleConflictError(err: any) {
    if (err?.response?.conflictBooking) {
      throw new BadRequestException({
        message: err.response.message,
        conflictBooking: err.response.conflictBooking,
      });
    }
    throw err;
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateBookingDto) {
    try {
      return await this.bookingsService.create({
        ...dto,
        source: this.resolveSource(dto),
      });
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Post('override')
  @Roles('ADMIN')
  async overrideBooking(@Body() dto: CreateBookingDto) {
    try {
      return await this.bookingsService.createOverride({
        ...dto,
        source: this.resolveSource(dto),
      });
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SUB_ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async patchUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    try {
      return await this.bookingsService.update(id, dto);
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Put(':id')
  @Roles('ADMIN')
 update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateBookingDto,
) {
  return this.patchUpdate(id, dto);
}

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}