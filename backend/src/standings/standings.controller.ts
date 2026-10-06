import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StandingsService } from './standings.service.js';
import { RecordStandingDto } from './dto/record-standing.dto.js';

@Controller('standings')
export class StandingsController {
  constructor(private standingsService: StandingsService) {}

  @Get('candidates/:fixtureId')
  getCandidates(@Param('fixtureId') fixtureId: string) {
    return this.standingsService.getCandidates(fixtureId);
  }

  @Post()
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