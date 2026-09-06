import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sport.findMany({ include: { disciplines: true } });
  }

  create(data: { name: string; formatType: string; maxDisciplines?: number }) {
    return this.prisma.sport.create({ data });
  }

  addDiscipline(sportId: string, data: { name: string }) {
    return this.prisma.discipline.create({ data: { name: data.name, sportId } });
  }
}