import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConfirmedResultsService } from './confirmed-results.service.js';
import { ConfirmResultDto } from './dto/confirm-result.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('confirmed-results')
export class ConfirmedResultsController {
  constructor(private confirmedResultsService: ConfirmedResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('head_organizer', 'super_admin')
  confirm(@Body() dto: ConfirmResultDto) {
    return this.confirmedResultsService.confirm(dto);
  }

  @Get()
  findAll() {
    return this.confirmedResultsService.findAll();
  }
}