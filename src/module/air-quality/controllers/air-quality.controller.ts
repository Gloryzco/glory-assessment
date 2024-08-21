import { Controller, Get, Query, Response } from '@nestjs/common';
import { GetAirQualityDto } from '../dtos';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AirQualityService } from '../services';
import { ResponseFormat } from 'src/shared';

@ApiTags('Air Quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @ApiNotFoundResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Ok',
  })
  @Get()
  async getAirQuality(@Response() res, @Query() query: GetAirQualityDto) {
    const response = await this.airQualityService.getAirQuality(query);
    ResponseFormat.successResponse(res, response, 'Air quality fetched successfully');
  }

  @ApiNotFoundResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Ok',
  })
  @Get('/most-polluted-time')
  async getMostPollutedTime(@Response() res,) {
    const mostPollutedDateTime = await this.airQualityService.getMostPollutedTime();
    ResponseFormat.successResponse(res, mostPollutedDateTime, 'Fetched successfully');
  }
}
