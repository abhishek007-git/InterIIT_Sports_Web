import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sport.findMany({ include: { disciplines: true } });
  }

  create(data: { name: string; formatType: string; maxDisciplines?: number }) {
    return this.prisma.sport.create({ data }).catch((error: unknown) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Sport '${data.name}' already exists`);
      }
      throw error;
    });
  }

  addDiscipline(sportId: string, data: { name: string }) {
    return this.prisma.discipline.create({ data: { name: data.name, sportId } });
  }
}