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
}