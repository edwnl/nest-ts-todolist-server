import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoListModule } from './todo-list/todo-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('TypeOrmModule');
        return {
          type: 'mongodb',
          url: configService.get<string>('MONGODB_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Set to false in production
          logging: ['query', 'error'],
          logger: 'advanced-console',
          connectionFactory: (connection) => {
            connection.driver.on('connect', () => {
              logger.log('MongoDB connection established');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    TodoListModule,
  ],
})
export class AppModule {}
