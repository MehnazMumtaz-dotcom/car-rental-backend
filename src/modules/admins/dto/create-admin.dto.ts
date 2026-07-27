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

  @IsOptional()
  @IsEnum(Role)
  role?: Role;


  @IsOptional()
  @IsArray()
  permissions?: string[];

}