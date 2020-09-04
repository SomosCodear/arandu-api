import { Test, TestingModule } from '@nestjs/testing';
import { CfpController } from './cfp.controller';

describe('CfpController', () => {
  let controller: CfpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CfpController],
    }).compile();

    controller = module.get<CfpController>(CfpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
