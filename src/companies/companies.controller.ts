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


  // CREATE COMPANY (POST)
  @Post()
  create(@Body() dto: any) {
    return this.companiesService.create(dto);
  }


  // GET ALL COMPANIES (GET)
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }


  // GET SINGLE COMPANY (GET BY ID)
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.companiesService.findOne(Number(id));
  }


  // UPDATE FULL COMPANY (PUT)
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.companiesService.update(Number(id), dto);
  }


  // PARTIAL UPDATE COMPANY (PATCH)
  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.companiesService.patch(Number(id), dto);
  }


  // DELETE COMPANY (DELETE)
  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.companiesService.remove(Number(id));
  }

}
