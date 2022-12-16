import { Module } from '@nestjs/common';
import { EconsultService } from './econsult.service';
import { EconsultController } from './econsult.controller';

@Module({
  controllers: [EconsultController],
  providers: [EconsultService],
})
export class EconsultModule {}
