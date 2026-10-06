import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller.js';
import { CertificatesService } from './certificates.service.js';
import { PdfModule } from '../pdf/pdf.module.js';

@Module({
  imports: [PdfModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}