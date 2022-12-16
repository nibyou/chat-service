import { Test, TestingModule } from '@nestjs/testing';
import { EconsultService } from './econsult.service';

describe('EconsultService', () => {
  let service: EconsultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EconsultService],
    }).compile();

    service = module.get<EconsultService>(EconsultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
