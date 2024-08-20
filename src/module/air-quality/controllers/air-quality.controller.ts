import { Controller, Get, Query } from '@nestjs/common';
// import { AirQualityService } from './air-quality.service';
import { GetAirQualityDto } from '../dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Air Quality')
@Controller('air-quality')
export class AirQualityController {
//   constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  async getAirQuality(@Query() query: GetAirQualityDto) {
    // const data = await this.airQualityService.getAirQuality(query);
    // await this.airQualityService.saveAirQuality(data, query);
    // return { Result: data };
  }

  @Get('/most-polluted-time')
  async getMostPollutedTime() {
    // const mostPolluted = await this.airQualityService.getMostPollutedTime();
    // return { mostPolluted };
  }
}
