import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondicionProductoService } from './condicion-producto.service';
import { CreateCondicionProductoDto } from './dto/create-condicion-producto.dto';
import { UpdateCondicionProductoDto } from './dto/update-condicion-producto.dto';

@Controller('condicion-producto')
export class CondicionProductoController {
  constructor(private readonly condicionProductoService: CondicionProductoService) {}

  @Post()
  create(@Body() createCondicionProductoDto: CreateCondicionProductoDto) {
    return this.condicionProductoService.create(createCondicionProductoDto);
  }

  @Get()
  getCondicionProducto() {
    return this.condicionProductoService.getCondicionProducto();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.condicionProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCondicionProductoDto: UpdateCondicionProductoDto) {
    return this.condicionProductoService.update(+id, updateCondicionProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.condicionProductoService.remove(+id);
  }
}
