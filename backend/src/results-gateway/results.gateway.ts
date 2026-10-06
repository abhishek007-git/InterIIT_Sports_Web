import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000' },
})
export class ResultsGateway {
  @WebSocketServer()
  server!: Server;

  emitResultConfirmed(payload: { fixtureId: string; value: string }) {
    this.server.emit('result-confirmed', payload);
  }
}