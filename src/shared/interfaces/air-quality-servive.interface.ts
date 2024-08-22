import { GetAirQualityDto } from 'src/module';
import { IPollutionData, IResultFromApi } from './air-quality.interface';

export interface IAirQualityService {
  getAirQuality(query: GetAirQualityDto): Promise<IResultFromApi>;
  checkParisAirQuality(): Promise<IResultFromApi | void>;
  getMostPollutedTime(): Promise<{ ts: string; maxAqius: number } | null>;
}
