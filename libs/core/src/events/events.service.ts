import { Injectable } from '@nestjs/common';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
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
    const spots = await this.prismaService.spot.findMany({
      where: {
        name: {
          in: reserveSpotDto.spots,
        },
        eventId: eventId,
      },
    });

    if (spots.length !== reserveSpotDto.spots.length) {
      //TODO: Retornar uma lista dos spots que nao foram encontrados
      throw new Error('Os assentos estão invalidos!');
    }

    try {
      //criando uma transação para salvar os registros de reserva e os tickets
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          //salvando os registros
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              email: reserveSpotDto.email,
              ticketKind: reserveSpotDto.ticketKind,
              status: TicketStatus.reserved,
            })),
          });

          //reservando os acentos
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

          //usei promisse .all para retornar os ids, o cratemany so retorna o count de itens inseridos
          const tickets = Promise.all(
            spots.map((spot) => {
              return prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  email: reserveSpotDto.email,
                  ticketKind: reserveSpotDto.ticketKind,
                },
              });
            }),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': //erro de concorrencia
          case 'P2034': //erro de trasnsaction conflit
            throw new Error('Os assentos ja estao reservados');
        }
      }
      throw error;
    }
  }
}
