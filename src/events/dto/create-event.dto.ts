import { IsDateString, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'O Nome do evento é obrigatorio' })
  name: string;

  @IsNotEmpty({ message: 'A descricao do evento é obrigatorio' })
  description: string;

  @IsNotEmpty({ message: 'O Local da organização do evento é obrigatorio' })
  location: string;

  image_url: string;

  @IsNotEmpty({ message: 'A Data do evento é obrigatoria' })
  @IsDateString(undefined, {
    message: 'Formato da data do evento é incorreto.',
  })
  eventDate: string;

  @IsNotEmpty({ message: 'A classificação do evento é obrigatoria' })
  rating: number;

  @IsPositive({ message: 'O custo do evento deve ser maior que 0' })
  price: number;
}
