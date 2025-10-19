import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateEstadoArticuloDto } from './dto/state-articulo.dto';

@ApiTags('Articulo')
@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo articulo' })
  @ApiResponse({ status: 201, description: 'Articulo creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateArticuloDto })
  createArticulo(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articuloService.createArticulo(createArticuloDto);
  }
  @Get()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los articulos' })
  @ApiResponse({ status: 200, description: 'Lista de articulos devuelta' })
  getArticulos() {
    return this.articuloService.getArticulos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un articulo por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del articulo',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Articulo encontrado' })
  @ApiResponse({ status: 404, description: 'Articulo no encontrado' })
  getArticulo(@Param('id') id: string) {
    return this.articuloService.getArticulo(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un articulo' })
  @ApiResponse({ status: 200, description: 'Articulo actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Articulo no encontrado' })
  @ApiBody({ type: UpdateArticuloDto })
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articuloService.updateArticulo(+id, updateArticuloDto);
  }

  @Patch('estado/:id')
  @ApiOperation({ summary: 'Actualizar estado de un articulo' })
  @ApiResponse({ status: 200, description: 'Articulo actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Articulo no encontrado' })
  @ApiBody({ type: UpdateEstadoArticuloDto })
  updateEstado(@Param('id') id: string, @Body() updateEstadoArticuloDto: UpdateEstadoArticuloDto) {
    return this.articuloService.updateEstadoArticulo(+id, updateEstadoArticuloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un articulo' })
  @ApiResponse({ status: 200, description: 'Articulo eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Articulo no encontrado' })
  remove(@Param('id') id: string) {
    return this.articuloService.deleteArticulo(+id);
  }
}
