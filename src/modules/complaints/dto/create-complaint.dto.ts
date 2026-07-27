import {
  IsInt,
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ComplaintCategory,
  ComplaintPriority,
} from '@prisma/client';

export class CreateComplaintDto {

  @Type(() => Number)
@IsInt()
@IsNotEmpty()
companyId: number;
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  bookingId: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assignedToId?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description: string;

  @IsOptional()
@IsEnum(ComplaintCategory)
category?: ComplaintCategory;

 @IsOptional()
@IsEnum(ComplaintPriority)
priority?: ComplaintPriority;

}