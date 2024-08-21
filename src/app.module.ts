import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirQualityModule, RedisModule } from './module';
import { LoggerService } from './logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AirQualityModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    AppService,
    LoggerService,
  ],
  exports: [LoggerService],
})
export class AppModule {}
