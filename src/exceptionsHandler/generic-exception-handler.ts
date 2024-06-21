import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
