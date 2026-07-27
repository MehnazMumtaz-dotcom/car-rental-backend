import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Put 
} from '@nestjs/common';

import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {

  constructor(
    private readonly companiesService: CompaniesService,
  ) {}


  @Post()
  create(@Body() dto: any) {
    return this.companiesService.create(dto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.companiesService.findOne(Number(id));
  }

  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.companiesService.update(Number(id), dto);
  }


  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.companiesService.patch(Number(id), dto);
  }


  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.companiesService.remove(Number(id));
  }

}
