import { Controller, Get, Query, Response } from '@nestjs/common';
import { GetAirQualityDto, MaxAqiusResponseDto } from '../dtos';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AirQualityService } from '../services';
import { ResponseFormat } from 'src/shared';
import { AirQualityResponseDto } from '../dtos/air-quality-response.dto';

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
    type: AirQualityResponseDto,
  })
  @ApiOperation({
    summary:
      'Get air quality for a given zone',
  })
  @Get()
  async getAirQuality(@Response() res, @Query() query: GetAirQualityDto) {
    const response = await this.airQualityService.getAirQuality(query);
    ResponseFormat.successResponse(
      res,
      response,
      'Air quality fetched successfully',
    );
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
    type: MaxAqiusResponseDto,
  })
  @ApiOperation({
    summary:
      'Get date and time where paris zone is the most polluted',
  })
  @Get('/paris-most-polluted-time')
  async getMostPollutedTimeOfParis(@Response() res) {
    const mostPollutedDateTime =
      await this.airQualityService.getMostPollutedTime();
    ResponseFormat.successResponse(
      res,
      mostPollutedDateTime,
      'Fetched successfully',
    );
  }
}
