import {
  Injectable,
  NotFoundException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoList } from './todo-list.entity';
import { AddItemDto, CreateTodoListDto, EditItemDto } from './todo-list.dto';
import { ObjectId } from 'mongodb';
import { InvalidObjectIdException } from '../exceptions/invalid-object-id.exception';

@Injectable()
export class TodoListService {
  private readonly logger = new Logger(TodoListService.name);

  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
  ) {}

  private validateObjectId(id: string): ObjectId {
    try {
      return new ObjectId(id);
    } catch (error) {
      throw new InvalidObjectIdException(id);
    }
  }

  async getAllTodoLists(): Promise<TodoList[]> {
    try {
      this.logger.log('Fetching all todo lists');
      return await this.todoListRepository.find();
    } catch (error) {
      this.logger.error(
        `Failed to fetch todo lists: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to fetch todo lists');
    }
  }

  async createTodoList(
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    try {
      const todoList = this.todoListRepository.create({
        ...createTodoListDto,
        items: [],
      });
      return await this.todoListRepository.save(todoList);
    } catch (error) {
      this.logger.error(
        `Failed to create todo list: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create todo list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTodoList(id: string): Promise<TodoList> {
    const objectId = this.validateObjectId(id);
    const todoList = await this.todoListRepository.findOne({
      where: { _id: objectId },
    });
    if (!todoList) {
      throw new NotFoundException(`Todo list with ID "${id}" not found`);
    }
    return todoList;
  }

  async addItem(id: string, addItemDto: AddItemDto): Promise<TodoList> {
    const todoList = await this.getTodoList(id);
    todoList.items.push({ _id: new ObjectId(), content: addItemDto.content });
    return this.todoListRepository.save(todoList);
  }

  async removeItem(id: string, itemId: string): Promise<TodoList> {
    const todoList = await this.getTodoList(id);
    const objectItemId = this.validateObjectId(itemId);
    const initialLength = todoList.items.length;
    todoList.items = todoList.items.filter(
      (item) => !item._id.equals(objectItemId),
    );
    if (todoList.items.length === initialLength) {
      throw new NotFoundException(
        `Item with ID "${itemId}" not found in todo list`,
      );
    }
    return this.todoListRepository.save(todoList);
  }

  async editItem(id: string, editItemDto: EditItemDto): Promise<TodoList> {
    const todoList = await this.getTodoList(id);
    const objectItemId = this.validateObjectId(editItemDto.itemId);
    const itemIndex = todoList.items.findIndex((item) =>
      item._id.equals(objectItemId),
    );
    if (itemIndex === -1) {
      throw new NotFoundException(
        `Item with ID "${editItemDto.itemId}" not found in todo list`,
      );
    }
    todoList.items[itemIndex].content = editItemDto.newContent;
    return this.todoListRepository.save(todoList);
  }

  async removeTodoList(id: string): Promise<{ message: string }> {
    const objectId = this.validateObjectId(id);
    const result = await this.todoListRepository.delete(objectId);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo list with ID "${id}" not found`);
    }
    return {
      message: `Todo list with ID "${id}" has been successfully removed`,
    };
  }
}
