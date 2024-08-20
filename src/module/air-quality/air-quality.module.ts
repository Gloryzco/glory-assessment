import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './controllers';
import { AirQuality } from 'src/entity';
import { AirQualityService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirQuality]),
  ],
  providers: [AirQualityService],
  controllers: [AirQualityController],
  exports: [],
})
export class AirQualityModule {}
    