import { BadRequestException } from '@nestjs/common';

export class InvalidObjectIdException extends BadRequestException {
  constructor(id: string) {
    super(`Invalid ObjectId format: ${id}`);
  }
}
