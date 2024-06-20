import { IsNotEmpty } from 'class-validator';

export class CreateSpotDto {
  @IsNotEmpty({ message: 'o nome do spot e obrigatorio' })
  name: string;
}
