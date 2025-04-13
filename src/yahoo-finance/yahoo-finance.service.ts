import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class YahooFinanceService {
  constructor(private readonly httpService: HttpService) {}

  async getNews(symbol: string): Promise<any> {
    const news = await yahooFinance.search(symbol, { newsCount: 200 });
    console.log(news.count);
    return news.news;
  }

  async getCurrentPrice(symbol: string): Promise<number> {
    const quote = await yahooFinance.quote(symbol);
    if (quote.regularMarketPrice === undefined) {
      throw new NotFoundException(`Price for symbol ${symbol} not found`);
    }
    return quote.regularMarketPrice;
  }

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
  
  async getPrices(symbols: string[]): Promise<{ [key: string]: number }> {
    const prices = {};
    for (const symbol of symbols) {
      try {
        const price = await this.getCurrentPrice(symbol);
        prices[symbol] = price;
      } catch (error) {
        console.warn(`Skipping symbol ${symbol} due to error: ${error.message}`);
      }
    }
    return prices;
  }
}
