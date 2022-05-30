import { Test, TestingModule } from '@nestjs/testing';
import { WssGateway } from './wss.gateway';
import { WssService } from './wss.service';

describe('WssGateway', () => {
  let gateway: WssGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WssGateway, WssService],
    }).compile();

    gateway = module.get<WssGateway>(WssGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
