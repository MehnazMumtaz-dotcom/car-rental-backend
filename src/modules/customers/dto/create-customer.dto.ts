import { IsNotEmpty, IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  // ✅ NEW FIELD (IMPORTANT)
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyId: number;
}