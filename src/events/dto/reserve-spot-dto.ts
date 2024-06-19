import { TicketKind } from '@prisma/client';
import { Allow, IsEmail } from 'class-validator';
import { IsTicketKindValid } from '../validator/ticket-kind-validator';

export class ReserveSpotDto {
  @Allow()
  spots: string[];

  @IsTicketKindValid()
  ticketKind: TicketKind;

  @IsEmail(undefined, { message: 'Digite um email valido.' })
  email: string;
}
