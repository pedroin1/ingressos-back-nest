export class CreatedEventDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
  ) {}
}
