import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger';

@Injectable()
export class AppService {
  constructor (private readonly loggerService: LoggerService){

  }
  getHealth(): string {
    this.loggerService.log('OK from air quality!');
    return 'OK from air quality!';
  }
}
