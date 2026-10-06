import { Module } from '@nestjs/common';
import { ConfirmedResultsController } from './confirmed-results.controller.js';
import { ConfirmedResultsService } from './confirmed-results.service.js';

@Module({
  controllers: [ConfirmedResultsController],
  providers: [ConfirmedResultsService],
})
export class ConfirmedResultsModule {}