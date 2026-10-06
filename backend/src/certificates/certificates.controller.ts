import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CertificatesService } from './certificates.service.js';

@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get(':participantId/:fixtureId')
  async download(
    @Param('participantId') participantId: string,
    @Param('fixtureId') fixtureId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.certificatesService.generate(participantId, fixtureId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="certificate.pdf"',
    });
    res.send(pdf);
  }
}