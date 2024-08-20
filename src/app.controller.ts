import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Health')
  @ApiOkResponse({
    status: 200,
    description: 'Service okay'
  })
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
