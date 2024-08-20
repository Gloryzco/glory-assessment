import { Controller, Get, Query } from '@nestjs/common';
import { GetAirQualityDto } from '../dtos';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { AirQualityService } from '../services';

@ApiTags('Air Quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @ApiNotFoundResponse({
    status: 404,
    description: 'Not Found'
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request'
  })
  @Get()
  async getAirQuality(@Query() query: GetAirQualityDto) {
  await this.airQualityService.getAirQuality(query);
    // await this.airQualityService.saveAirQuality( query);
    // return { Result: data };
  }

  @Get('/most-polluted-time')
  async getMostPollutedTime() {
    // const mostPolluted = await this.airQualityService.getMostPollutedTime();
    // return { mostPolluted };
  }
}
