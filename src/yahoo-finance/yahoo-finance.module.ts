import { Module } from '@nestjs/common';
import { YahooFinanceService } from './yahoo-finance.service';
import { YahooFinanceController } from './yahoo-finance.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YahooFinanceService],
  controllers: [YahooFinanceController],
})
export class YahooFinanceModule {}
