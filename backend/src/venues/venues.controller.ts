import { Body, Controller, Get, Post } from '@nestjs/common';
import { VenuesService } from './venues.service.js';

@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; capacity?: number }) {
    return this.venuesService.create(body);
  }
}