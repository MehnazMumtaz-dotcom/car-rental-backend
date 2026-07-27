import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
export class AssignComplaintDto {

  @Type(() => Number)
@IsInt()
@IsNotEmpty()
adminId: number;

}