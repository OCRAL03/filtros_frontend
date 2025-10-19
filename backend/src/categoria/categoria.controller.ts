import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categoria')
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  
  @ApiOperation({ summary: 'Crear una nueva categoria' })
  @ApiResponse({ status: 201, description: 'Categoria creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateCategoriaDto })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  } 

  @Get()
  
  @ApiOperation({ summary: 'Obtener todas las categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias devuelta' })
  getCategorias() {
    return this.categoriaService.getCategorias();
  }

  @Get(':id')
  
  @ApiOperation({ summary: 'Obtener una categoria por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único de la categoria',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria no encontrada' })
  getCategoria(@Param('id') id: string) {
    return this.categoriaService.getCategoria(+id);
  }

  @Patch(':id')
  
  @ApiOperation({ summary: 'Actualizar una categoria' })
  @ApiResponse({ status: 200, description: 'Categoria actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Categoria no encontrada' })
  @ApiBody({ type: UpdateCategoriaDto })
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaService.updateCategoria(+id, updateCategoriaDto);
  }

  @Delete(':id')
  
  @ApiOperation({ summary: 'Eliminar una categoria' })
  @ApiResponse({ status: 200, description: 'Categoria eliminada correctamente' })
  @ApiResponse({ status: 400, description: 'Categoria no encontrada' })
  remove(@Param('id') id: string) {
    return this.categoriaService.deleteCategoria(+id);
  }
}
