import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from '../controllers/air-quality.controller';
import { AirQualityService } from '../services';
import { Response } from 'express';
import { GetAirQualityDto } from '../dtos';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let service: AirQualityService;

  const mockAirQualityService = {
    getAirQuality: jest.fn(),
    getMostPollutedTime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: mockAirQualityService,
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    service = module.get<AirQualityService>(AirQualityService);
  });

  describe('getAirQuality', () => {
    it('should return air quality data', async () => {
      const query: GetAirQualityDto = { latitude: 48.8566, longitude: 2.3522 };
      const mockResponse = {
        Result: {
          Pollution: {
            ts: '2024-08-21T00:00:00Z',
            aqius: 50,
            mainus: 'pm2_5',
            aqicn: 40,
            maincn: 'pm2_5',
          },
        },
      };

      jest.spyOn(service, 'getAirQuality').mockResolvedValue(mockResponse as any);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getAirQuality(res, query);

      expect(service.getAirQuality).toHaveBeenCalledWith(query);
      expect(res.json).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'Air quality fetched successfully',
        code: '00',
        data: mockResponse,
      });
    });
  });

  describe('getMostPollutedTimeOfParis', () => {
    it('should return the most polluted time for Paris', async () => {
      const mockResponse = {
        ts: '2024-08-21T00:00:00Z',
        maxAqius: 100,
      };

      jest.spyOn(service, 'getMostPollutedTime').mockResolvedValue(mockResponse as any);

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.getMostPollutedTimeOfParis(res);

      expect(service.getMostPollutedTime).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        status: 'SUCCESS',
        message: 'Fetched successfully',
        code: '00',
        data: mockResponse,
      });
    });
  });
});
