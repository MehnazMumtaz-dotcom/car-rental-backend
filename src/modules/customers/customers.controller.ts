import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

import { AuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(AuthGuard, RoleGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
@Roles('ADMIN', 'MANAGER')
findAll(@Req() req) {
  return this.customersService.findAll(
    req.user.companyId,
  );
}

  @Get('company/:companyId')
  @Roles('ADMIN', 'MANAGER')
  findAllByCompany(@Param('companyId') companyId: string) {
    return this.customersService.findAll(Number(companyId));
  }

  @Get('company/:companyId/:id')
  @Roles('ADMIN', 'MANAGER')
  findOneByCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.customersService.findOneByCompany(
      Number(companyId),
      Number(id),
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles('ADMIN')
  patch(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.customersService.update(
      Number(id),
      dto,
    );
  }

  @Patch('company/:companyId/:id')
  @Roles('ADMIN')
  patchByCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.customersService.updateByCompany(
      Number(companyId),
      Number(id),
      dto,
    );
  }
  @Put(':id')
  @Roles('ADMIN')
  put(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.customersService.update(
      Number(id),
      dto,
    );
  }
  @Put('company/:companyId/:id')
  @Roles('ADMIN')
  putByCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.customersService.updateByCompany(
      Number(companyId),
      Number(id),
      dto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.customersService.remove(
      Number(id),
    );
  }

  @Delete('company/:companyId/:id')
  @Roles('ADMIN')
  removeByCompany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.customersService.removeByCompany(
      Number(companyId),
      Number(id),
    );
  }
}