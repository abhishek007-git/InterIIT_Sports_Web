import { Module } from '@nestjs/common';
import { RawEntriesController } from './raw-entries.controller.js';
import { RawEntriesService } from './raw-entries.service.js';

@Module({
  controllers: [RawEntriesController],
  providers: [RawEntriesService],
})
export class RawEntriesModule {}