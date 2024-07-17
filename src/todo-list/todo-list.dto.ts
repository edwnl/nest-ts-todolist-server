import { ObjectId } from 'mongodb';

export class CreateTodoListDto {
  name: string;
}

export class AddItemDto {
  content: string;
}

export class EditItemDto {
  itemId: string;
  newContent: string;
}
