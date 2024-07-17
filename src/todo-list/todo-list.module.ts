import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TodoList } from './todo-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoList])],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
