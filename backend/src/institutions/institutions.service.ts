import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.institution.findMany();
  }

  create(data: { name: string; contactName?: string; contactPhone?: string }) {
    return this.prisma.institution.create({ data });
  }
}