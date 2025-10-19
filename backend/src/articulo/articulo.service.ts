import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';

@Injectable()
export class ArticuloService {

  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>
  ) { }

  async createArticulo(createArticuloDto: CreateArticuloDto) {
    try {
      const newArticulo = this.articuloRepository.create(createArticuloDto);
      return await this.articuloRepository.save(newArticulo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el artículo'
      );
    }
  }

  async getArticulos() {
    try {
      return await this.articuloRepository.find({
        relations: ["idCategoria2", "idMarca2", "idCondicionProducto2"],
        select: {
          idCategoria2: {
            idCategoria: true,
            nombre: true,
          },
          idMarca2: {
            idMarca: true,
            nombre: true,
          },
          idCondicionProducto2: {
            idCondicionProducto: true,
            nombre: true,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los artículos',
      );
    }
  }

  async getArticulo(id: number) {
    try {
      const agendaFound = await this.articuloRepository.findOne({
        where: { idArticulo: id },
        relations: ["idCategoria2", "idMarca2", "idCondicionProducto2"],
        select: {
          idCategoria2: {
            idCategoria: true,
            nombre: true,
          },
          idMarca2: {
            idMarca: true,
            nombre: true,
          },
          idCondicionProducto2: {
            idCondicionProducto: true,
            nombre: true,
          },
        },
      });
      if (!agendaFound) {
        throw new NotFoundException('Artículo no encontrado');
      }

      return agendaFound;
    }
    catch (error) {
      throw new InternalServerErrorException('Error interno al obtener el artículo.');
    }
  }

  async updateArticulo(idArticulo: number, updateArticuloDto: UpdateArticuloDto) {
    try {
      const agendaFound = await this.articuloRepository.findOneBy({ idArticulo });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${idArticulo} no encontrada`);
      }

      const updatedAgenda = Object.assign(agendaFound, updateArticuloDto);

      return await this.articuloRepository.save(updatedAgenda);
    } catch (error) {

      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una agenda con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar la agenda.');
    }
  }

  async updateEstadoArticulo(idArticulo: number, updateEstadoArticuloDto: any) {
    try {
      const articuloFound = await this.articuloRepository.findOneBy({ idArticulo });
      if (!articuloFound) {
        throw new NotFoundException(`Artículo con ID ${idArticulo} no encontrado`);
      }
      const updatedArticulo = Object.assign(articuloFound, updateEstadoArticuloDto);
      return await this.articuloRepository.save(updatedArticulo);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un artículo con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar el artículo.');
    }
  }

  async deleteArticulo(idArticulo: number) {
    try {
      const deleteResult = await this.articuloRepository.delete(idArticulo);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Artículo con ID ${idArticulo} no encontrado`);
      }
      return { message: `Artículo con ID ${idArticulo} eliminado correctamente` };
    } catch (error) {
      // 👉 Si ya es una excepción HTTP (como NotFoundException), la relanzamos
      if (error instanceof HttpException) {
        throw error;
      }

      // Errores de conexión a la base de datos
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }
      throw new InternalServerErrorException('Error interno al eliminar el artículo.');
    }
  }
}
