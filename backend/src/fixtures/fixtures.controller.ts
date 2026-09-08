import { Body, Controller, Get, Post } from '@nestjs/common';
import { FixturesService } from './fixtures.service.js';
import { CreateFixtureDto } from './dto/create-fixtures.dto.js';

@Controller('fixtures')
export class FixturesController {
  constructor(private fixturesService: FixturesService) {}

  @Get()
  findAll() {
    return this.fixturesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateFixtureDto) {
    return this.fixturesService.create(dto);
  }
}