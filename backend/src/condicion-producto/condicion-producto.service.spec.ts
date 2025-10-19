import { Test, TestingModule } from '@nestjs/testing';
import { CondicionProductoService } from './condicion-producto.service';

describe('CondicionProductoService', () => {
  let service: CondicionProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondicionProductoService],
    }).compile();

    service = module.get<CondicionProductoService>(CondicionProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
