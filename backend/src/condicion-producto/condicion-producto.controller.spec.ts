import { Test, TestingModule } from '@nestjs/testing';
import { CondicionProductoController } from './condicion-producto.controller';
import { CondicionProductoService } from './condicion-producto.service';

describe('CondicionProductoController', () => {
  let controller: CondicionProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondicionProductoController],
      providers: [CondicionProductoService],
    }).compile();

    controller = module.get<CondicionProductoController>(CondicionProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
