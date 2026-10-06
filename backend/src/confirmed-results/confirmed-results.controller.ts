import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfirmedResultsService } from './confirmed-results.service.js';
import { ConfirmResultDto } from './dto/confirm-result.dto.js';

@Controller('confirmed-results')
export class ConfirmedResultsController {
  constructor(private confirmedResultsService: ConfirmedResultsService) {}

  @Post()
  confirm(@Body() dto: ConfirmResultDto) {
    return this.confirmedResultsService.confirm(dto);
  }

  @Get()
  findAll() {
    return this.confirmedResultsService.findAll();
  }
}