import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirQuality } from 'src/entity';
import { AxiosHelper } from 'src/shared';
import { RedisService } from 'src/module/redis';
import { LoggerService } from 'src/logger';
import { GetAirQualityDto } from '../dtos';
import configuration from 'src/config/configuration';
import AppError from 'src/shared/utils/AppError';

const config = configuration();

@Injectable()
export class AirQualityService {
  private readonly IQAIR_API_KEY = config.iqair.api_key;

  constructor(
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAirQuality(query: GetAirQualityDto) {
    const { longitude, latitude } = query;
    const cacheKey = `lat:${latitude} long:${longitude}`;

    let resultFromCache = await this.redisService.get(cacheKey);
    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }

    try {
      const apiResponse = await AxiosHelper.sendGetRequest(
        `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.IQAIR_API_KEY}`,
      );
      const pollutionData = apiResponse.data.data.current.pollution;

      const resultFromApi = {
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

      await this.redisService.set(cacheKey, JSON.stringify(resultFromApi));

      return resultFromApi;
    } catch (error) {
      this.loggerService.error('Error fetching air quality data', error);
      throw new AppError('0002', error.message);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkParisAirQuality() {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;
    const cacheKey = `lat:${parisLatitude} long:${parisLongitude}`;
    this.loggerService.log('Cron job started for Paris air quality check');
    try {
      const apiResponse = await AxiosHelper.sendGetRequest(
        `https://api.airvisual.com/v2/nearest_city?lat=${parisLatitude}&lon=${parisLongitude}&key=${this.IQAIR_API_KEY}`,
      );

      const pollutionData = apiResponse.data.data.current.pollution;

      const resultFromApi = {
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

      await this.saveAirQuality(resultFromApi.Result.Pollution, {
        latitude: parisLatitude,
        longitude: parisLongitude,
      });

      return resultFromApi;
    } catch (error) {
      this.loggerService.error(
        'Failed to fetch and save Paris air quality data',
        error,
      );
    }
  }

  async saveAirQuality(
    pollutionData: any,
    query: { latitude: number; longitude: number },
  ) {
    const airQuality = new AirQuality();
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
