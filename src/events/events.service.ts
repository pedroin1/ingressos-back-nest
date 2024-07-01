import { Injectable } from '@nestjs/common';
import { Event, Prisma, Spot, SpotStatus, TicketStatus } from '@prisma/client';
import { GenericException } from 'src/exceptionsHandler/generic-exception-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreatedEventDto } from './dto/created-event-dto';
import { ReserveSpotDto } from './dto/reserve-spot-dto';
import {
  transformFromPrismaDateTime,
  transformToPrismaDateTime,
} from 'src/utils/Date';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const eventCreated = await this.prismaService.event.create({
      data: {
        ...createEventDto,
        eventDate: transformToPrismaDateTime(createEventDto.eventDate),
      },
    });

    return this.convertEventToDto(eventCreated);
  }

  async findAll() {
    const eventsList = await this.prismaService.event.findMany();

    return this.convertEventListToDto(eventsList);
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findFirst({
      where: { id: id },
    });

    return this.convertEventToDto(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const eventUpdated = await this.prismaService.event.update({
      where: { id: id },
      data: updateEventDto,
    });

    return this.convertEventToDto(eventUpdated);
  }

  async remove(id: string) {
    const eventRemoved = await this.prismaService.event.delete({
      where: { id: id },
    });

    return `Evento "${eventRemoved.name} removido com sucesso!" `;
  }

  async reserveSpots(eventId: string, reserveSpotDto: ReserveSpotDto) {
    const spotsAvailableFromDB = await this.findSpotsByNameAndEventId(
      eventId,
      reserveSpotDto.spots,
    );

    if (spotsAvailableFromDB.length !== reserveSpotDto.spots.length) {
      const invalidSpots = reserveSpotDto.spots.filter(
        (spot) => !spotsAvailableFromDB.map((spot) => spot.name).includes(spot),
      );

      throw new GenericException(
        `Os assentos '${invalidSpots.toString()}' Já Estão Reservados!`,
      );
    }

    try {
      const transactionResult = await this.prismaService.$transaction(
        async (prisma) => {
          await this.createReservationHistory(
            prisma,
            reserveSpotDto,
            spotsAvailableFromDB,
          );
          await this.updateSpotStatusToReserved(prisma, spotsAvailableFromDB);
          const createdTickets = await this.createTickets(
            prisma,
            reserveSpotDto,
            spotsAvailableFromDB,
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
        status: 'available',
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

  private convertEventListToDto(eventList: Event[]): CreatedEventDto[] {
    return eventList.map((event) => this.convertEventToDto(event));
  }

  private convertEventToDto(event: Event): CreatedEventDto {
    return new CreatedEventDto(
      event.id,
      event.name,
      event.description,
      event.location,
      event.image_url,
      transformFromPrismaDateTime(event.eventDate),
      event.price,
      event.rating,
    );
  }
}
