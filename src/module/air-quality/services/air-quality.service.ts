import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { AirQuality } from 'src/entity';
import { AxiosHelper } from 'src/shared';
import { GetAirQualityDto } from '../dtos';
import configuration from 'src/config/configuration';

const config = configuration();

@Injectable()
export class AirQualityService {
  private readonly IQAIR_API_KEY = config.iqair.api_key;

  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
  ) {}

  async getAirQuality(query: GetAirQualityDto) {
    const { longitude, latitude } = query;
    // const apiResponse = await AxiosHelper.sendGetRequest(
    //   `https://api-iqair.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.IQAIR_API_KEY}`,
    // );
    console.log(this.IQAIR_API_KEY);
  }

  async saveAirQuality(data: any) {
    const airQuality = new AirQuality();
    airQuality.ts = new Date(data.data.current.pollution.ts);
    airQuality.aqius = data.data.current.pollution.aqius;
    airQuality.mainus = data.data.current.pollution.mainus;
    airQuality.aqicn = data.data.current.pollution.aqicn;
    airQuality.maincn = data.data.current.pollution.maincn;

    return this.airQualityRepository.save(airQuality);
  }

  async getMostPollutedTime() {
    return this.airQualityRepository
      .createQueryBuilder('airQuality')
      .select('ts, MAX(aqius)', 'maxAqius')
      .groupBy('ts')
      .orderBy('MAX(aqius)', 'DESC')
      .limit(1)
      .getRawOne();
  }
}
