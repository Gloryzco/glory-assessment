import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './controllers';
import { AirQuality } from 'src/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirQuality]),
  ],
  providers: [],
  controllers: [AirQualityController],
  exports: [],
})
export class AirQualityModule {}
    