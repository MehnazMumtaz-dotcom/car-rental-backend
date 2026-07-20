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

  // 🔥 helper
  resolveSource(dto: CreateBookingDto) {
    return (
      dto.source ??
      (dto.customerId
        ? BookingSource.ONLINE
        : BookingSource.WALK_IN)
    );
  }

  // 🔥 common error handler
  handleConflictError(err: any) {
    if (err?.response?.conflictBooking) {
      throw new BadRequestException({
        message: err.response.message,
        conflictBooking: err.response.conflictBooking,
      });
    }
    throw err;
  }

  // ➕ CREATE
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

  // ⚠️ OVERRIDE
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

  // 📄 GET ALL
  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll() {
    return this.bookingsService.findAll();
  }

  // 🔍 GET ONE
  @Get(':id')
  @Roles('ADMIN', 'SUB_ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  // ✏️ UPDATE
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

  // PUT
  @Put(':id')
  @Roles('ADMIN')
 update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateBookingDto,
) {
  return this.patchUpdate(id, dto);
}

  // ❌ DELETE
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}