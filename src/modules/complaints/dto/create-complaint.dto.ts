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

  @IsInt()
companyId: number;
  // ✅ Required
  @Type(() => Number)
  @IsInt()
  bookingId: number;


  // ✅ Optional (assign later)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assignedToId?: number;


  // ✅ Strong validation
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description: string;


  // ✅ Enum validation clean
  @IsOptional()
@IsEnum(ComplaintCategory)
category?: ComplaintCategory;

  @IsEnum(ComplaintPriority)
  priority: ComplaintPriority;

}