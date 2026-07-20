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

import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(AuthGuard, RoleGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}

  // CREATE CUSTOMER
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  // GET ALL CUSTOMERS
  @Get()
@Roles('ADMIN', 'MANAGER')
findAll(@Req() req) {
  return this.customersService.findAll(
    req.user.companyId,
  );
}

  // GET ALL CUSTOMERS BY COMPANY
  @Get('company/:companyId')
  @Roles('ADMIN', 'MANAGER')
  findAllByCompany(@Param('companyId') companyId: string) {
    return this.customersService.findAll(Number(companyId));
  }

  // GET SINGLE CUSTOMER BY COMPANY
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

  // GET SINGLE CUSTOMER
  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(Number(id));
  }

  // PATCH NORMAL
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

  // PATCH BY COMPANY
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

  // PUT NORMAL
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

  // PUT BY COMPANY
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

  // DELETE NORMAL
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.customersService.remove(
      Number(id),
    );
  }

  // DELETE BY COMPANY
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