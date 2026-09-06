import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SportsService } from './sports.service.js';

@Controller('sports')
export class SportsController {
  constructor(private sportsService: SportsService) {}

  @Get()
  findAll() {
    return this.sportsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; formatType: string; maxDisciplines?: number }) {
    return this.sportsService.create(body);
  }

  @Post(':id/disciplines')
  addDiscipline(@Param('id') id: string, @Body() body: { name: string }) {
    return this.sportsService.addDiscipline(id, body);
  }
}