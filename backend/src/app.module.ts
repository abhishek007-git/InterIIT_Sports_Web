import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SportsModule } from './sports/sports.module.js';
import { InstitutionsModule } from './institutions/institutions.module.js';
import { ParticipantsModule } from './participants/participants.module.js';

@Module({
  imports: [PrismaModule, SportsModule, InstitutionsModule, ParticipantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}