export class CreatedSpotDto {
  constructor(
    readonly id: string,
    readonly eventId: string,
    readonly name: string,
    readonly status: string,
  ) {}
}
