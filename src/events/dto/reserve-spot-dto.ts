import { TicketKind } from '@prisma/client';
import { Allow, Contains, IsEmpty, Length } from 'class-validator';

export class ReserveSpotDto {
  @Allow()
  spots: string[];

  ticketKind: TicketKind;
  email: string;
}
