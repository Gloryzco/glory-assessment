import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirQualityModule } from './module';
import { LoggerService } from './logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AirQualityModule],
  controllers: [AppController],
  providers: [AppService, LoggerService],
  exports: [LoggerService],
})
export class AppModule {}
