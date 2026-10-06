import { Body, Controller, Get, Post } from '@nestjs/common';
import { RawEntriesService } from './raw-entries.service.js';
import { CreateRawEntryDto } from './dto/create-raw-entry.dto.js';

@Controller('raw-entries')
export class RawEntriesController {
  constructor(private rawEntriesService: RawEntriesService) {}

  @Post()
  create(@Body() dto: CreateRawEntryDto) {
    return this.rawEntriesService.create(dto);
  }

  @Get('pending')
  findPending() {
    return this.rawEntriesService.findPending();
  }
}