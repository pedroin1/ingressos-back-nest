import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  Spot,
  SpotStatus,
  TicketStatus,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot-dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({ data: createEventDto });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findFirst({ where: { id: id } });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: { id: id },
      data: updateEventDto,
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({ where: { id: id } });
  }

  async reserveSpots(eventId: string, reserveSpotDto: ReserveSpotDto) {
    const spotsFromDB = await this.findSpotsByNameAndEventId(
      eventId,
      reserveSpotDto.spots,
    );

    if (spotsFromDB.length !== reserveSpotDto.spots.length) {
      //TODO: Retornar uma lista dos spots que nao foram encontrados
      throw new Error('Os assentos estão invalidos!');
    }

    try {
      const transactionResult = await this.prismaService.$transaction(
        async (prisma) => {
          await this.createReservationHistory(
            prisma,
            reserveSpotDto,
            spotsFromDB,
          );
          await this.updateSpotStatusToReserved(prisma, spotsFromDB);
          const createdTickets = await this.createTickets(
            prisma,
            reserveSpotDto,
            spotsFromDB,
          );

          return createdTickets;
        },
      );

      return transactionResult;
    } catch (error) {
      this.handlePrismaErrors(error);
    }
  }

  private async findSpotsByNameAndEventId(
    eventId: string,
    spotNames: string[],
  ) {
    return await this.prismaService.spot.findMany({
      where: {
        name: {
          in: spotNames,
        },
        eventId: eventId,
      },
    });
  }

  private async createReservationHistory(
    prisma: any,
    reserveSpotDto: ReserveSpotDto,
    spots: Spot[],
  ) {
    const { email, ticketKind } = reserveSpotDto;
    await prisma.reservationHistory.createMany({
      data: spots.map((spot) => ({
        spotId: spot.id,
        email,
        ticketKind,
        status: TicketStatus.reserved,
      })),
    });
  }

  private async updateSpotStatusToReserved(prisma: any, spots: Spot[]) {
    await prisma.spot.updateMany({
      where: {
        id: {
          in: spots.map((spot) => spot.id),
        },
      },
      data: {
        status: SpotStatus.reserved,
      },
    });
  }

  private async createTickets(
    prisma: any,
    reserveSpotDto: ReserveSpotDto,
    spots: Spot[],
  ) {
    const { email, ticketKind } = reserveSpotDto;
    const tickets = await Promise.all(
      spots.map((spot) => {
        return prisma.ticket.create({
          data: {
            spotId: spot.id,
            email,
            ticketKind,
          },
        });
      }),
    );

    return tickets;
  }

  private handlePrismaErrors(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // erro de concorrência
        case 'P2034': // erro de conflito de transação
          throw new Error('Os assentos já estão reservados');
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}
