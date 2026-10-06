import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfirmResultDto } from './dto/confirm-result.dto.js';
import { ResultsGateway } from '../results-gateway/results.gateway.js';

@Injectable()
export class ConfirmedResultsService {
  constructor(
    private prisma: PrismaService,
    private resultsGateway: ResultsGateway,
  ) {}

  async confirm(dto: ConfirmResultDto) {
    const result = await this.prisma.confirmedResult.upsert({
      where: { fixtureId: dto.fixtureId },
      update: { confirmedBy: dto.confirmedBy, value: dto.value, notes: dto.notes, confirmedAt: new Date() },
      create: { fixtureId: dto.fixtureId, confirmedBy: dto.confirmedBy, value: dto.value, notes: dto.notes },
    });

    await this.prisma.fixture.update({
      where: { id: dto.fixtureId },
      data: { status: 'confirmed' },
    });

    this.resultsGateway.emitResultConfirmed({ fixtureId: dto.fixtureId, value: dto.value });

    return result;
  }

  findAll() {
    return this.prisma.confirmedResult.findMany({
      include: { fixture: { include: { discipline: { include: { sport: true } }, venue: true } } },
      orderBy: { confirmedAt: 'desc' },
    });
  }
}