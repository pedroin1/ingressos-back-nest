export class CreatedEventDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly location: string,
    readonly image_url: string,
    readonly date: Date,
    readonly price: number,
    readonly rating: number,
  ) {}
}
