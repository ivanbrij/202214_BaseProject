import { Test, TestingModule } from '@nestjs/testing';
import { SupermarketService } from './supermarket.service';

describe('SupermarketService', () => {
  let service: SupermarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
