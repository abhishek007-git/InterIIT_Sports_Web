import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RecordStandingDto } from './dto/record-standing.dto.js';

type Totalled = { institutionId: string; name: string; points: number };

@Injectable()
export class StandingsService {
  constructor(private prisma: PrismaService) {}

  async getCandidates(fixtureId: string) {
    const fixture = await this.prisma.fixture.findUnique({
      where: { id: fixtureId },
      include: {
        discipline: {
          include: {
            registrationEvents: { include: { participant: { include: { institution: true } } } },
          },
        },
      },
    });
    if (!fixture) {
      throw new NotFoundException('Fixture not found');
    }
    return fixture.discipline.registrationEvents.map((re) => re.participant);
  }

  recordStanding(dto: RecordStandingDto) {
    return this.prisma.fixtureStanding.create({
      data: {
        fixtureId: dto.fixtureId,
        institutionId: dto.institutionId,
        participantId: dto.participantId,
        rank: dto.rank,
        points: dto.points,
      },
    });
  }

  async getPerSportStandings(sportId: string) {
    const standings = await this.prisma.fixtureStanding.findMany({
      where: { fixture: { discipline: { sportId } } },
      include: { institution: true },
    });
    return this.aggregate(standings);
  }

  async getOverallStandings() {
    const standings = await this.prisma.fixtureStanding.findMany({ include: { institution: true } });
    return this.aggregate(standings);
  }

  private aggregate(standings: { institutionId: string; institution: { name: string }; points: number }[]): Totalled[] {
    const totals = new Map<string, Totalled>();
    for (const s of standings) {
      const existing = totals.get(s.institutionId);
      if (existing) {
        existing.points += s.points;
      } else {
        totals.set(s.institutionId, { institutionId: s.institutionId, name: s.institution.name, points: s.points });
      }
    }
    return Array.from(totals.values()).sort((a, b) => b.points - a.points);
  }
}