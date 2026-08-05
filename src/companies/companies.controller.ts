import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Put,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('companies')
@UseGuards(AuthGuard, RoleGuard)
export class CompaniesController {

  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  private assertOwnCompany(req: any, id: number) {
    if (req.user.companyId !== id) {
      throw new ForbiddenException(
        'You cannot access another company\'s data',
      );
    }
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: any) {
    return this.companiesService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll(@Req() req) {
    // Koi SUPER_ADMIN role exist nahi karta is system mein,
    // is liye sirf apni khud ki company dikhayenge
    return this.companiesService.findOne(req.user.companyId);
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id') id: string,
    @Req() req,
  ) {
    this.assertOwnCompany(req, Number(id));
    return this.companiesService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('ADMIN')
  replace(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req,
  ) {
    this.assertOwnCompany(req, Number(id));
    return this.companiesService.update(Number(id), dto);
  }


  @Patch(':id')
  @Roles('ADMIN')
  patch(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req,
  ) {
    this.assertOwnCompany(req, Number(id));
    return this.companiesService.patch(Number(id), dto);
  }


  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    this.assertOwnCompany(req, Number(id));
    return this.companiesService.remove(Number(id));
  }

}
