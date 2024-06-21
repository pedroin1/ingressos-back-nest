import { Injectable } from '@nestjs/common';
import { Spot, SpotStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { CreatedSpotDto } from './dto/created-spot-dto';
import { UpdateSpotDto } from './dto/update-spot.dto';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(eventId: string, createSpotDto: CreateSpotDto) {
    const existEvent = await this.prismaService.event.findFirst({
      where: { id: eventId },
    });

    if (!existEvent) {
      throw new Error('Evento não encontrado');
    }

    const spotCreated = await this.prismaService.spot.create({
      data: {
        name: createSpotDto.name,
        eventId: eventId,
        status: SpotStatus.available,
      },
    });

    return this.convertSpotToDto(spotCreated);
  }

  async createMany(eventId: string, createSpotDtoList: CreateSpotDto[]) {
    const existEvent = await this.prismaService.event.findFirst({
      where: { id: eventId },
    });

    if (!existEvent) {
      throw new Error('Evento não encontrado');
    }

    const spotsData = createSpotDtoList.map((dto) => ({
      ...dto,
      status: SpotStatus.available,
      eventId: eventId,
    }));

    const spotListCreated = await this.prismaService.spot.createManyAndReturn({
      data: spotsData,
    });
    return this.convertSpotListToDto(spotListCreated);
  }

  async findAll(eventId: string) {
    const spotList = await this.prismaService.spot.findMany({
      where: { eventId },
    });
    return this.convertSpotListToDto(spotList);
  }

  async findOne(eventId: string, spotId: string) {
    const spot = await this.prismaService.spot.findFirst({
      where: { id: spotId, eventId },
    });

    return this.convertSpotToDto(spot);
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    const updatedSpot = await this.prismaService.spot.update({
      where: { id: spotId, eventId },
      data: {
        name: updateSpotDto.name,
        eventId: eventId,
        status: SpotStatus.available,
      },
    });

    return this.convertSpotToDto(updatedSpot);
  }

  async remove(eventId: string, spotId: string) {
    const spotRemoved = await this.prismaService.spot.delete({
      where: { id: spotId, eventId },
    });
    return `O assento "${spotRemoved.name} foi removido com sucesso!"`;
  }

  private convertSpotListToDto(spotList: Spot[]): CreatedSpotDto[] {
    return spotList.map((event) => this.convertSpotToDto(event));
  }

  private convertSpotToDto(spot: Spot): CreatedSpotDto {
    return new CreatedSpotDto(spot.id, spot.eventId, spot.name, spot.status);
  }
}
