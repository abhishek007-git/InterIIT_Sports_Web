import { Body, Controller, Get, Post } from '@nestjs/common';
import { SportsService } from './sports.service.js';

@Controller('sports')
export class SportsController {
  constructor(private sportsService: SportsService) {}

  @Get()
  findAll() {
    return this.sportsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; formatType: string }) {
    return this.sportsService.create(body);
  }
}