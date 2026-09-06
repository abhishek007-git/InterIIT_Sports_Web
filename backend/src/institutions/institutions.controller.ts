import { Body, Controller, Get, Post } from '@nestjs/common';
import { InstitutionsService } from './institutions.service.js';

@Controller('institutions')
export class InstitutionsController {
  constructor(private institutionsService: InstitutionsService) {}

  @Get()
  findAll() {
    return this.institutionsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; contactName?: string; contactPhone?: string }) {
    return this.institutionsService.create(body);
  }
}