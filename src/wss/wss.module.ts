import { Module } from '@nestjs/common';
import { WssService } from './wss.service';
import { WssGateway } from './wss.gateway';

@Module({
  providers: [WssGateway, WssService],
})
export class WssModule {}
