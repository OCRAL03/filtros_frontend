import { Module } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  controllers: [ArticuloController],
  providers: [ArticuloService],
})
export class ArticuloModule {}