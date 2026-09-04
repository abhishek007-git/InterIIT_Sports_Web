import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sport.findMany();
  }

  create(data: { name: string; formatType: string }) {
    return this.prisma.sport.create({ data });
  }
}