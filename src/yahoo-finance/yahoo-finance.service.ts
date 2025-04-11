import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YahooFinanceService {
  constructor(private readonly httpService: HttpService) {}

  async getStockData(symbol: string, period1: number, period2: number): Promise<any> {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1wk&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic`;

    const response: AxiosResponse<any> = await firstValueFrom(this.httpService.get(url));
    const result = response.data.chart.result[0].indicators.quote[0];

    return {
      close: result.close,
      high: result.high,
      low: result.low,
      open: result.open,
      volume: result.volume,
      amount: {
        close: result.close.length,
        high: result.high.length,
        low: result.low.length,
        open: result.open.length,
        volume: result.volume.length,
      },
    };
  }
}
