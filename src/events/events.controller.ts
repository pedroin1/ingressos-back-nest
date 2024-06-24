import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot-dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

// criado gerado a partir do comando -> nest g resource NOME <-
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto[]) {
    return await this.eventsService.create(createEventDto);
  }

  @Post(':eventId/reserve')
  async reserveSpots(
    @Param('eventId') eventId: string,
    @Body() reserveSpots: ReserveSpotDto,
  ) {
    return await this.eventsService.reserveSpots(eventId, reserveSpots);
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.eventsService.remove(id);
  }
}
