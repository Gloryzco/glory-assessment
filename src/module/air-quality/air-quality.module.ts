import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './controllers';
import { AirQuality } from 'src/entity';
import { AirQualityService } from './services';
import { RedisModule } from '../redis';
import { LoggerService } from 'src/logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirQuality]),
    RedisModule,
  ],
  providers: [AirQualityService, LoggerService],
  controllers: [AirQualityController],
  exports: [],
})
export class AirQualityModule {}
    