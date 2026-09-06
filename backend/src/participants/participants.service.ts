import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParticipantDto } from './dto/create-participant.dto.js';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.participant.findMany({
      include: { institution: true, registrationEvents: { include: { discipline: true } } },
    });
  }

  async create(dto: CreateParticipantDto) {
    const sport = await this.prisma.sport.findUnique({
      where: { id: dto.sportId },
      include: { disciplines: true },
    });
    if (!sport) {
      throw new BadRequestException('Sport not found');
    }

    const validIds = new Set(sport.disciplines.map((d) => d.id));
    if (dto.disciplineIds.length > sport.maxDisciplines) {
      throw new BadRequestException(
        `${sport.name} allows at most ${sport.maxDisciplines} discipline(s), got ${dto.disciplineIds.length}`,
      );
    }
    for (const id of dto.disciplineIds) {
      if (!validIds.has(id)) {
        throw new BadRequestException('One of the chosen disciplines does not belong to this sport');
      }
    }

    return this.prisma.participant.create({
      data: {
        name: dto.name,
        registrationNo: dto.registrationNo,
        gender: dto.gender,
        mobile: dto.mobile,
        email: dto.email,
        foodPreference: dto.foodPreference,
        bloodGroup: dto.bloodGroup,
        arrivalAt: dto.arrivalAt ? new Date(dto.arrivalAt) : null,
        departureAt: dto.departureAt ? new Date(dto.departureAt) : null,
        emergencyContact: dto.emergencyContact,
        institutionId: dto.institutionId,
        registrationEvents: {
          create: dto.disciplineIds.map((disciplineId) => ({
            disciplineId,
            weightCategory: dto.weightCategory ?? null,
          })),
        },
      },
      include: { registrationEvents: true },
    });
  }
}