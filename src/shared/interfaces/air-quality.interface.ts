export interface IPollutionData {
  ts: string;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
}

export interface IAirQualityApiResponse {
  data: {
    data: {
      current: {
        pollution: IPollutionData;
      };
    };
  };
}

export interface IResultFromApi {
  Result: {
    Pollution: IPollutionData;
  };
}

export interface IAirQuality {
    ts: Date;
    aqius: number;
    mainus: string;
    aqicn: number;
    maincn: string;
    latitude: number;
    longitude: number;
    recordedAt: Date;
  }
