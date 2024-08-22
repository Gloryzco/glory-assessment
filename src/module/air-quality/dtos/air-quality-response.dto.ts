import { ApiProperty } from '@nestjs/swagger';

export class PollutionDto {
  @ApiProperty({
    example: '2024-08-21T11:00:00.000Z',
    description: 'The timestamp of the pollution data.',
  })
  ts: string;

  @ApiProperty({
    example: 72,
    description: 'The AQI (Air Quality Index) value according to the US standards.',
  })
  aqius: number;

  @ApiProperty({
    example: 'p2',
    description: 'The main pollutant in the air according to the US standards.',
  })
  mainus: string;

  @ApiProperty({
    example: 29,
    description: 'The AQI value according to the Chinese standards.',
  })
  aqicn: number;

  @ApiProperty({
    example: 'p2',
    description: 'The main pollutant in the air according to the Chinese standards.',
  })
  maincn: string;
}

export class ResultDto {
  @ApiProperty({
    description: 'The pollution data result.',
    type: PollutionDto,
  })
  Pollution: PollutionDto;
}

export class AirQualityResponseDto {
  @ApiProperty({
    description: 'The air quality response data containing pollution details.',
    type: ResultDto,
  })
  Result: ResultDto;
}


