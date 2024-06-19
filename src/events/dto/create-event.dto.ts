import { IsNotEmpty, IsPositive, isNumber } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'O Nome do Evento é obrigatorio' })
  name: string;

  @IsNotEmpty({ message: 'A descricao do Evento é obrigatorio' })
  description: string;

  @IsPositive({ message: 'O valor do evento deve ser maior que 0' })
  price: number;
}
