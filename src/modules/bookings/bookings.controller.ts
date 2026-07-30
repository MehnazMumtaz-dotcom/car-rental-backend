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
  Request,
} from '@nestjs/common';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  BookingSource,
} from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('bookings')
@UseGuards(AuthGuard, RoleGuard, PermissionsGuard)
@RequirePermission('bookingCalendar')
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
  async create(@Body() dto: CreateBookingDto, @Request() req) {
    try {
      return await this.bookingsService.create(
        {
          ...dto,
          source: this.resolveSource(dto),
        },
        req.user.companyId,
      );
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Post('override')
  @Roles('ADMIN')
  async overrideBooking(@Body() dto: CreateBookingDto, @Request() req) {
    try {
      return await this.bookingsService.createOverride(
        {
          ...dto,
          source: this.resolveSource(dto),
        },
        req.user.companyId,
      );
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Get()
  @Roles('ADMIN', 'SUB_ADMIN')
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUB_ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.bookingsService.findOne(id, req.user.companyId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async patchUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @Request() req,
  ) {
    try {
      return await this.bookingsService.update(id, dto, req.user.companyId);
    } catch (err) {
      this.handleConflictError(err);
    }
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.patchUpdate(id, dto, req);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.bookingsService.remove(id, req.user.companyId);
  }
}