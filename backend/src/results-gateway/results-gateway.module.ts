import { Module } from '@nestjs/common';
import { ResultsGateway } from './results.gateway.js';

@Module({
  providers: [ResultsGateway],
  exports: [ResultsGateway],
})
export class ResultsGatewayModule {}