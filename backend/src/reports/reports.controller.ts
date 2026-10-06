import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('sport/:sportId')
  async download(@Param('sportId') sportId: string, @Res() res: Response) {
    const pdf = await this.reportsService.generateSportReport(sportId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="sport-report.pdf"',
    });
    res.send(pdf);
  }
}