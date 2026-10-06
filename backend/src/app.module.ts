import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SportsModule } from './sports/sports.module.js';
import { InstitutionsModule } from './institutions/institutions.module.js';
import { ParticipantsModule } from './participants/participants.module.js';
import { VenuesModule } from './venues/venues.module.js';
import { FixturesModule } from './fixtures/fixtures.module.js';
import { RawEntriesModule } from './raw-entries/raw-entries.module.js';
import { ConfirmedResultsModule } from './confirmed-results/confirmed-results.module.js';
import { StandingsModule } from './standings/standings.module.js';
import { PdfModule } from './pdf/pdf.module.js';
import { CertificatesModule } from './certificates/certificates.module.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [
    PrismaModule, SportsModule, InstitutionsModule, ParticipantsModule, VenuesModule,
    FixturesModule, RawEntriesModule, ConfirmedResultsModule, StandingsModule,
    PdfModule, CertificatesModule, ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}