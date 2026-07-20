import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignComplaintDto {

  @Type(() => Number)
  @IsInt()
  adminId: number;

}