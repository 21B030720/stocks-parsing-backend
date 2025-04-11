import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import * as moment from 'moment';

@ApiTags('yahoo-finance')
@Controller('yahoo-finance')
export class YahooFinanceController {
  constructor(private readonly yahooFinanceService: YahooFinanceService) {}

  @ApiOperation({ summary: 'Get stock data' })
  @ApiQuery({ name: 'symbol', required: true, description: 'Stock symbol' })
  @ApiQuery({ name: 'period1', required: true, description: 'Start date (DD/MM/YYYY)' })
  @ApiQuery({ name: 'period2', required: true, description: 'End date (DD/MM/YYYY)' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of stock data'
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('stock-data')
  async getStockData(
    @Query('symbol') symbol: string,
    @Query('period1') period1: string,
    @Query('period2') period2: string
  ) {
    const startDate = moment(period1, 'DD/MM/YYYY');
    const endDate = moment(period2, 'DD/MM/YYYY');

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new BadRequestException('Invalid date format. Use DD/MM/YYYY.');
    }

    const period1Unix = startDate.unix();
    const period2Unix = endDate.unix();

    return this.yahooFinanceService.getStockData(symbol, period1Unix, period2Unix);
  }


  @ApiOperation({ summary: 'Get current stock price' })
  @ApiQuery({ name: 'symbol', required: true, description: 'Stock symbol' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of current stock price',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('price')
  async getPrice(@Query('symbol') symbol: string) {
    const price = await this.yahooFinanceService.getCurrentPrice(symbol);
    return { symbol, price };
  }

  @ApiOperation({ summary: 'Get news by stock symbol' })
  @ApiQuery({ name: 'symbol', required: true, description: 'Stock symbol' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of news by stock symbol',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Get('news')
  async getNewsBySymbol(@Query('symbol') symbol: string) {
    const news = await this.yahooFinanceService.getNews(symbol);
    return { symbol, news };
  }

}
