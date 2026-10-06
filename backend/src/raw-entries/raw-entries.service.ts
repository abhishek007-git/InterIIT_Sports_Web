import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRawEntryDto } from './dto/create-raw-entry.dto.js';

@Injectable()
export class RawEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRawEntryDto) {
    const entry = await this.prisma.rawEntry.create({ data: dto });
    await this.prisma.fixture.update({
      where: { id: dto.fixtureId },
      data: { status: 'pending_confirmation' },
    });
    return entry;
  }

  findPending() {
    return this.prisma.fixture.findMany({
      where: { status: 'pending_confirmation' },
      include: {
        discipline: { include: { sport: true } },
        venue: true,
        rawEntries: { orderBy: { createdAt: 'desc' } },
      },
    });
  }
}