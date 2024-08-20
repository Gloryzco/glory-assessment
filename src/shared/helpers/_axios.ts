import axios from 'axios';
import { IAxiosHelperResponse } from '../interfaces';
import configuration from 'src/config/configuration';

const config = configuration();

export class AxiosHelper {
  static async sendGetRequest(
    path: string,
    headers: Record<string, unknown>,
  ): Promise<IAxiosHelperResponse> {
    const response = await axios.get(path, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return {
      data: response.data,
      status: response.status,
    };
  }
}
