import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { RedisService } from 'src/module/redis';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirQuality } from 'src/entity';
import { LoggerService } from 'src/logger';
import { AxiosHelper } from 'src/shared';
import AppError from 'src/shared/utils/AppError';

describe('AirQualityService', () => {
  let service: AirQualityService;
  let redisService: RedisService;
  let httpService: HttpService;
  let loggerService: LoggerService;
  let axiosHelper: AxiosHelper;
  let airQualityRepository: Repository<AirQuality>;

  beforeEach(async () => {
    axiosHelper = { sendGetRequest: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        { provide: RedisService, useValue: { get: jest.fn(), set: jest.fn() } },
        { provide: HttpService, useValue: { get: jest.fn() } },
        { provide: AxiosHelper, useValue: axiosHelper },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
        {
          provide: getRepositoryToken(AirQuality),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getRawOne: jest.fn().mockResolvedValue({
                ts: '2024-08-19T00:00:00Z',
                maxAqius: 55,
              }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    redisService = module.get<RedisService>(RedisService);
    httpService = module.get<HttpService>(HttpService);
    loggerService = module.get<LoggerService>(LoggerService);
    airQualityRepository = module.get<Repository<AirQuality>>(
      getRepositoryToken(AirQuality),
    );
    service['axiosHelper'] = axiosHelper;
  });

  describe('getAirQuality', () => {
    it('should return cached data if available', async () => {
      const mockResult = {
        Result: {
          Pollution: {
            ts: '2024-08-19T00:00:00Z',
            aqius: 45,
            mainus: 'mn',
            aqicn: 33,
            maincn: 'mc',
          },
        },
      };
      const query = { latitude: 48.8566, longitude: 2.3522 };

      jest
        .spyOn(redisService, 'get')
        .mockResolvedValue(JSON.stringify(mockResult));
      const result = await service.getAirQuality(query);
      expect(result).toEqual(mockResult);
    });

    it('should fetch data from API and save to cache if not cached', async () => {
      const mockApiResponse = {
        Result: {
          Pollution: {
            ts: '2024-08-19T00:00:00Z',
            aqius: 45,
            mainus: 'mn',
            aqicn: 33,
            maincn: 'mc',
          },
        },
      };
      const query = { latitude: 48.8566, longitude: 2.3522 };

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest
        .spyOn(service as any, 'fetchAirQualityFromApi')
        .mockResolvedValue(mockApiResponse);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      const result = await service.getAirQuality(query);
      expect(result).toEqual(mockApiResponse);
      expect(service['fetchAirQualityFromApi']).toHaveBeenCalledWith(
        query.latitude,
        query.longitude,
      );
      expect(redisService.set).toHaveBeenCalledWith(
        `lat:${query.latitude} long:${query.longitude}`,
        JSON.stringify(mockApiResponse),
      );
    });
  });

  describe('getMostPollutedTime', () => {
    it('should return the most polluted time', async () => {
      const expectedResult = {
        ts: '2024-08-19T00:00:00Z',
        maxAqius: 55,
      };

      const result = await service.getMostPollutedTime();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('fetchAirQualityFromApi', () => {
    it('should throw an error if the API call fails', async () => {
      const latitude = 4567;
      const longitude = 3456;
      const mockError = new Error('API error');

      jest
        .spyOn(AxiosHelper, 'sendGetRequest')
        .mockRejectedValueOnce(mockError);

      await expect(
        service['fetchAirQualityFromApi'](latitude, longitude),
      ).rejects.toThrow(
        new AppError('0002', 'Error fetching air quality data from API'),
      );
    });
  });

  describe('saveAirQuality', () => {
    it('should throw an error if saving to the database fails', async () => {
      const mockPollutionData = {
        ts: '2024-08-19T00:00:00Z',
        aqius: 45,
        mainus: 'mn',
        aqicn: 33,
        maincn: 'mc',
      };
      const query = { latitude: 48.8566, longitude: 2.3522 };
      const mockError = new Error('DB Error');

      jest.spyOn(airQualityRepository, 'save').mockRejectedValueOnce(mockError);

      await expect(
        service['saveAirQuality'](mockPollutionData, query),
      ).rejects.toThrow(
        new AppError('0002', 'Error saving data to the database'),
      );
    });
  });
});
