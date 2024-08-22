import { ApiProperty } from "@nestjs/swagger";

export class MaxAqiusResponseDto {
    @ApiProperty({
      example: '2024-08-21T11:00:00.000Z',
      description: 'The timestamp when the maximum AQI was recorded.',
    })
    ts: string;
  
    @ApiProperty({
      example: 32,
      description: 'The maximum AQI value recorded.',
    })
    maxAqius: number;
  }