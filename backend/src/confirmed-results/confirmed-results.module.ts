import { Module } from '@nestjs/common';
import { ConfirmedResultsController } from './confirmed-results.controller.js';
import { ConfirmedResultsService } from './confirmed-results.service.js';
import { ResultsGatewayModule } from '../results-gateway/results-gateway.module.js';

@Module({
  imports: [ResultsGatewayModule],
  controllers: [ConfirmedResultsController],
  providers: [ConfirmedResultsService],
})
export class ConfirmedResultsModule {}