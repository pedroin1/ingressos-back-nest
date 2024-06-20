import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot-dto';

// criado gerado a partir do comando -> nest g resource NOME <-
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Post(':eventId/reserve')
  async reserveSpots(
    @Param('eventId') eventId: string,
    @Body() reserveSpots: ReserveSpotDto,
  ) {
    try {
      return await this.eventsService.reserveSpots(eventId, reserveSpots);
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: (error as Error).message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: (error as Error).message,
        },
      );
    }
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
