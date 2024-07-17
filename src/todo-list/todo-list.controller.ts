import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoListDto, AddItemDto, EditItemDto } from './todo-list.dto';
import { TodoList } from './todo-list.entity';
import { InvalidObjectIdException } from '../exceptions/invalid-object-id.exception';

@Controller('todo-list')
export class TodoListController {
  private readonly logger = new Logger(TodoListController.name);

  constructor(private readonly todoListService: TodoListService) {}

  @Post()
  async createTodoList(
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    try {
      this.logger.log(
        `Creating todo list: ${JSON.stringify(createTodoListDto)}`,
      );
      return await this.todoListService.createTodoList(createTodoListDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async getAllTodoLists(): Promise<TodoList[]> {
    try {
      this.logger.log('Getting all todo lists');
      return await this.todoListService.getAllTodoLists();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async getTodoList(@Param('id') id: string): Promise<TodoList> {
    try {
      this.logger.log(`Getting todo list with ID: ${id}`);
      return await this.todoListService.getTodoList(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post(':id/items')
  async addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddItemDto,
  ): Promise<TodoList> {
    try {
      this.logger.log(
        `Adding item to todo list ${id}: ${JSON.stringify(addItemDto)}`,
      );
      return await this.todoListService.addItem(id, addItemDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id/items/:itemId')
  async removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<TodoList> {
    try {
      this.logger.log(`Removing item "${itemId}" from todo list ${id}`);
      return await this.todoListService.removeItem(id, itemId);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id/items')
  async editItem(
    @Param('id') id: string,
    @Body() editItemDto: EditItemDto,
  ): Promise<TodoList> {
    try {
      this.logger.log(
        `Editing item in todo list ${id}: ${JSON.stringify(editItemDto)}`,
      );
      return await this.todoListService.editItem(id, editItemDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async removeTodoList(@Param('id') id: string): Promise<{ message: string }> {
    try {
      this.logger.log(`Removing todo list with ID: ${id}`);
      return await this.todoListService.removeTodoList(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof InvalidObjectIdException) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } else if (error instanceof NotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } else {
      this.logger.error(error.message, error.stack);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
