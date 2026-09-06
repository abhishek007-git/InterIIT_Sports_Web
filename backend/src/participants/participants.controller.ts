import { Body, Controller, Get, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service.js';
import { CreateParticipantDto } from './dto/create-participant.dto.js';

@Controller('participants')
export class ParticipantsController {
  constructor(private participantsService: ParticipantsService) {}

  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateParticipantDto) {
    return this.participantsService.create(dto);
  }
}