import { Test, TestingModule } from '@nestjs/testing';
import { EconsultController } from './econsult.controller';
import { EconsultService } from './econsult.service';

describe('EconsultController', () => {
  let controller: EconsultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EconsultController],
      providers: [EconsultService],
    }).compile();

    controller = module.get<EconsultController>(EconsultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
