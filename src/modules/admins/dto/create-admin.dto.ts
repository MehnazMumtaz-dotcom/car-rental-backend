import {
  IsEmail,
  IsString,
  MinLength,
  IsInt,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

import { Role } from '@prisma/client';


export class CreateAdminDto {

  @IsString()
  name: string;


  @IsEmail()
  email: string;


  @MinLength(6)
  password: string;


  @IsInt()
  companyId: number;


  // ✅ ADMIN / SUB_ADMIN
  @IsOptional()
  @IsEnum(Role)
  role?: Role;


  // ✅ permissions array
  @IsOptional()
  @IsArray()
  permissions?: string[];

}