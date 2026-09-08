import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.venue.findMany();
  }

  create(data: { name: string; capacity?: number }) {
    return this.prisma.venue.create({ data });
  }
}