import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirQuality } from 'src/entity';
import { IAirQualityApiResponse, AxiosHelper, IAirQualityService, IPollutionData, IResultFromApi, IAirQuality } from 'src/shared';
import { RedisService } from 'src/module/redis';
import { LoggerService } from 'src/logger';
import { GetAirQualityDto } from '../dtos';
import configuration from 'src/config/configuration';
import AppError from 'src/shared/utils/AppError';

const config = configuration();

@Injectable()
export class AirQualityService implements IAirQualityService {
  private readonly IQAIR_API_KEY = config.iqair.api_key;

  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAirQuality(query: GetAirQualityDto): Promise<IResultFromApi> {
    const { longitude, latitude } = query;
    const cacheKey: string = `lat:${latitude} long:${longitude}`;
    
    const resultFromCache: string = await this.redisService.get(cacheKey);
    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }

    const resultFromApi = await this.fetchAirQualityFromApi(latitude, longitude);
    await this.redisService.set(cacheKey, JSON.stringify(resultFromApi));

    return resultFromApi;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkParisAirQuality() {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;
    this.loggerService.log('Cron job started for Paris air quality check');
    
    try {
      const resultFromApi = await this.fetchAirQualityFromApi(parisLatitude, parisLongitude);
      await this.saveAirQuality(resultFromApi.Result.Pollution, {
        latitude: parisLatitude,
        longitude: parisLongitude,
      });
    } catch (error) {
      this.loggerService.error('Failed to fetch and save Paris air quality data', error);
    }
  }

  private async fetchAirQualityFromApi(latitude: number, longitude: number): Promise<IResultFromApi> {
    try {
      const apiResponse: IAirQualityApiResponse = await AxiosHelper.sendGetRequest(
        `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.IQAIR_API_KEY}`,
      );

      const pollutionData: IPollutionData = apiResponse.data?.data?.current?.pollution;

      return {
        Result: {
          Pollution: {
            ts: pollutionData.ts,
            aqius: pollutionData.aqius,
            mainus: pollutionData.mainus,
            aqicn: pollutionData.aqicn,
            maincn: pollutionData.maincn,
          },
        },
      };
    } catch (error) {
      this.loggerService.error('Error fetching air quality data from API', error);
      throw new AppError('0002', "Error fetching air quality data from API");
    }
  }

  private async saveAirQuality(
    pollutionData: IPollutionData,
    query: { latitude: number; longitude: number },
  ) {
    const airQuality: IAirQuality = new AirQuality();
    airQuality.ts = new Date(pollutionData.ts);
    airQuality.aqius = pollutionData.aqius;
    airQuality.mainus = pollutionData.mainus;
    airQuality.aqicn = pollutionData.aqicn;
    airQuality.maincn = pollutionData.maincn;
    airQuality.latitude = query.latitude;
    airQuality.longitude = query.longitude;
    airQuality.recordedAt = new Date();

    try {
      const savedData = await this.airQualityRepository.save(airQuality);
      if (savedData) {
        this.loggerService.log(`Data saved to DB successfully via CRON: ${JSON.stringify(savedData)}`);
      }
    } catch (error) {
      this.loggerService.error('Error saving data to the database', error);
      throw new AppError('0002', "Error saving data to the database");
    }
  }

  async getMostPollutedTime() {
    return this.airQualityRepository
      .createQueryBuilder('airQuality')
      .select('ts')
      .addSelect('MAX(aqius)', 'maxAqius')
      .groupBy('ts')
      .orderBy('MAX(aqius)', 'DESC')
      .limit(1)
      .getRawOne();
  }
}
