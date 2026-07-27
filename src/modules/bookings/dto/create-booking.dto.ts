import {
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

export enum BookingSource {
  WALK_IN = 'WALK_IN',
  ONLINE = 'ONLINE',
}

const emptyStringToUndefined = ({ value }: { value: unknown }): unknown =>
  value === '' ? undefined : value;

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  vehicleId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  customerId?: number;

  @Type(() => Number)
  @IsInt()
  companyId: number;
  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsString()
  customerName?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsString()
  phone?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsString()
  cnic?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  pickupTime?: string;

  @IsOptional()
  @IsString()
  dropTime?: string;

  @Type(() => Number)
  @IsNumber()
  dailyRate: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  advance?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  forceOverride?: boolean;

  @IsOptional()
  @IsEnum(BookingSource)
  source?: BookingSource;
}
