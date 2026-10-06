import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StandingsService } from './standings.service.js';
import { RecordStandingDto } from './dto/record-standing.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('standings')
export class StandingsController {
  constructor(private standingsService: StandingsService) {}

  @Get('candidates/:fixtureId')
  getCandidates(@Param('fixtureId') fixtureId: string) {
    return this.standingsService.getCandidates(fixtureId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('head_organizer', 'super_admin')
  recordStanding(@Body() dto: RecordStandingDto) {
    return this.standingsService.recordStanding(dto);
  }

  @Get('sport/:sportId')
  getPerSportStandings(@Param('sportId') sportId: string) {
    return this.standingsService.getPerSportStandings(sportId);
  }

  @Get('overall')
  getOverallStandings() {
    return this.standingsService.getOverallStandings();
  }
}