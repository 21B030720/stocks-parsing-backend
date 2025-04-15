import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import * as moment from 'moment';

@ApiTags('yahoo-finance')
@Controller('yahoo-finance')
export class YahooFinanceController {
  constructor(private readonly yahooFinanceService: YahooFinanceService) {}

  @ApiOperation({ summary: 'Convert currency' })
  @ApiQuery({ name: 'value', required: true, description: 'Value to convert' })
  @ApiQuery({ name: 'base', required: true, description: 'Base currency' })
  @ApiQuery({ name: 'target', required: true, description: 'Target currency' })
  @ApiResponse({
    status: 200,
    description: 'Successful conversion of currency',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('convert')
  async convertCurrency(
    @Query('value') value: number,
    @Query('base') base: string,
    @Query('target') target: string
  ) {
    const convertedValue = await this.yahooFinanceService.convertCurrency(value, base, target);
    return { value, base, target, convertedValue };
  }


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
    const startDate = moment.utc(period1, 'DD/MM/YYYY');
    const endDate = moment.utc(period2, 'DD/MM/YYYY');

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
  
  @ApiOperation({ summary: 'Get assets data' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of assets data',
  })
  @Get('assets')
  async getAssets() {
    const symbols = [
      'KSPI',
      'AAPL', 'MSFT', 'SBUX', 'CSCO', 'QCOM',
      'NDX', '^GSPC',
      // 'HSBK.IL'
      // 'KZAP'
      // 'KZTO'
      // 'KZTK'
      // 'KASE'
    ];

    const prices = await this.yahooFinanceService.getPrices(symbols);

    return {
      categories: [
        {
          title: 'Местные',
          type: 'local',
          assets: [
            {
              name: 'Kaspi.kz',
              ticker: 'KSPI',
              amount: {
                value: prices['KSPI'],
                currency: '₸'
              },
              change: '-0.61%',
              image: 'https://logo.clearbit.com/kaspi.kz'
            },
            // {
            //   name: 'Halyk Bank AO',
            //   ticker: 'HSBK',
            //   amount: {
            //     value: prices['HSBK.IL'],
            //     currency: '₸'
            //   },
            //   change: '+7.55%',
            //   image: 'https://logo.clearbit.com/halykbank.kz'
            // },
            // {
            //   name: 'Kazakhtelekom AO',
            //   ticker: 'KZTK',
            //   amount: {
            //     value: prices['KZTK'],
            //     currency: '₸'
            //   },
            //   change: '+0.43%',
            //   image: 'https://logo.clearbit.com/telecom.kz'
            // },
            // {
            //   name: 'KazTransOil AO',
            //   ticker: 'KZTO',
            //   amount: {
            //     value: prices['KZTO'],
            //     currency: '₸'
            //   },
            //   change: '-0.04%',
            //   image: 'https://logo.clearbit.com/kaztransoil.kz'
            // },
            // {
            //   name: 'NAK Kazatomprom AO',
            //   ticker: 'KZAP',
            //   amount: {
            //     value: prices['KZAP'],
            //     currency: '₸'
            //   },
            //   change: '-3.37%',
            //   image: 'https://logo.clearbit.com/kazatomprom.kz'
            // }
          ]
        },
        {
          title: 'Международные',
          type: 'international',
          assets: [
            {
              name: 'Apple Inc.',
              ticker: 'AAPL',
              amount: {
                value: prices['AAPL'],
                currency: '$'
              },
              change: '-2.66%',
              image: 'https://logo.clearbit.com/apple.com'
            },
            {
              name: 'Microsoft Corp.',
              ticker: 'MSFT',
              amount: {
                value: prices['MSFT'],
                currency: '$'
              },
              change: '-1.23%',
              image: 'https://logo.clearbit.com/microsoft.com'
            },
            {
              name: 'Starbucks Corp.',
              ticker: 'SBUX',
              amount: {
                value: prices['SBUX'],
                currency: '$'
              },
              change: '-0.74%',
              image: 'https://logo.clearbit.com/starbucks.com'
            },
            {
              name: 'Cisco Systems Inc.',
              ticker: 'CSCO',
              amount: {
                value: prices['CSCO'],
                currency: '$'
              },
              change: '-0.59%',
              image: 'https://logo.clearbit.com/cisco.com'
            },
            {
              name: 'QUALCOMM',
              ticker: 'QCOM',
              amount: {
                value: prices['QCOM'],
                currency: '$'
              },
              change: '+1.16%',
              image: 'https://logo.clearbit.com/qualcomm.com'
            }
          ]
        },
        {
          title: 'ETF и Индексы',
          type: 'etf_index',
          assets: [
            {
              name: 'NASDAQ 100',
              ticker: 'NDX',
              amount: {
                value: prices['NDX'],
                currency: '$'
              },
              change: '-0.90%',
              image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/NASDAQ_Logo.svg'
            },
            {
              name: 'S&P 500',
              ticker: 'SPX',
              amount: {
                value: prices['^GSPC'],
                currency: '$',
              },
              change: '-0.72%',
              image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Standard_%26_Poor%27s_logo.svg'
            },
            // {
            //   name: 'KASE Index',
            //   ticker: 'KASE',
            //   amount: {
            //     value: prices['KASE'],
            //     currency: '₸'
            //   },
            //   change: '+0.12%',
            //   image: 'https://logo.clearbit.com/kase.kz'
            // }
          ]
        }
      ]
    };
  }
  

}
