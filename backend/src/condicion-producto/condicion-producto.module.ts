import { Module } from '@nestjs/common';
import { CondicionProductoService } from './condicion-producto.service';
import { CondicionProductoController } from './condicion-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CondicionProducto } from './entities/condicion-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CondicionProducto])],
  controllers: [CondicionProductoController],
  providers: [CondicionProductoService],
})
export class CondicionProductoModule {}
