import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';

import { Role, AdminStatus } from '@prisma/client';


export class UpdateAdminDto {


  @IsOptional()
  @IsString()
  name?: string;


  @IsOptional()
  @IsString()
  email?: string;


  @IsOptional()
  @IsString()
  password?: string;


  @IsOptional()
  @IsString()
  city?: string;


  @IsOptional()
  @IsEnum(Role)
  role?: Role;


  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  @IsEnum(AdminStatus)
  status?: AdminStatus;
}