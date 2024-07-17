import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDto {
  @ApiProperty({ description: 'The name of the todo list' })
  name: string;
}

export class AddItemDto {
  content: string;
}

export class EditItemDto {
  itemId: string;
  newContent: string;
}
