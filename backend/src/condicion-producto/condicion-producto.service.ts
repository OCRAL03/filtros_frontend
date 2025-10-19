import { Injectable } from '@nestjs/common';
import { CreateCondicionProductoDto } from './dto/create-condicion-producto.dto';
import { UpdateCondicionProductoDto } from './dto/update-condicion-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CondicionProducto } from './entities/condicion-producto.entity';


@Injectable()
export class CondicionProductoService {
  constructor(
    @InjectRepository(CondicionProducto)
    private condicionProductoRepository: Repository<CondicionProducto>,
  ) {}

  create(createCondicionProductoDto: CreateCondicionProductoDto) {
    return 'This action adds a new condicionProducto';
  }

  getCondicionProducto() {
    return this.condicionProductoRepository.find();
  }

  findAll() {
    return `This action returns all condicionProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condicionProducto`;
  }

  update(id: number, updateCondicionProductoDto: UpdateCondicionProductoDto) {
    return `This action updates a #${id} condicionProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} condicionProducto`;
  }
}
