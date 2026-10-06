import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';
import { PdfModule } from '../pdf/pdf.module.js';

@Module({
  imports: [PdfModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}