import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFixtureDto } from './dto/create-fixtures.dto.js';

@Injectable()
export class FixturesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.fixture.findMany({
      include: { discipline: { include: { sport: true } }, venue: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  create(dto: CreateFixtureDto) {
    return this.prisma.fixture.create({
      data: {
        disciplineId: dto.disciplineId,
        venueId: dto.venueId,
        scheduledAt: new Date(dto.scheduledAt),
        stage: dto.stage,
      },
      include: { discipline: { include: { sport: true } }, venue: true },
    });
  }
}