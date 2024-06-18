import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(eventId: string, createSpotDto: CreateSpotDto) {
    const existEvent = await this.prismaService.event.findFirst({
      where: { id: eventId },
    });
    console.log(eventId);

    if (!existEvent) {
      throw new Error('Evento não encontrado');
    }

    return this.prismaService.spot.create({
      data: {
        name: createSpotDto.name,
        eventId: eventId,
        status: SpotStatus.available,
      },
    });
  }

  async createMany(eventId: string, createSpotDtoList: CreateSpotDto[]) {
    const existEvent = await this.prismaService.event.findFirst({
      where: { id: eventId },
    });
    console.log(eventId);

    if (!existEvent) {
      throw new Error('Evento não encontrado');
    }

    const spotsData = createSpotDtoList.map((dto) => ({
      ...dto,
      status: SpotStatus.available,
      eventId: eventId,
    }));

    return this.prismaService.spot.createMany({ data: spotsData });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({ where: { eventId } });
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findFirst({
      where: { id: spotId, eventId },
    });
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      where: { id: spotId, eventId },
      data: {
        name: updateSpotDto.name,
        eventId: eventId,
        status: SpotStatus.available,
      },
    });
  }

  remove(eventId: string, spotId: string) {
    return this.prismaService.spot.delete({ where: { id: spotId, eventId } });
  }
}
