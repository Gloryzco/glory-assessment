import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class GetAirQualityDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  @ApiProperty({
    description: 'longitude',
    required: true,
  })
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  @ApiProperty({
    description: 'latitude',
    required: true,
  })
  latitude: number;
}
