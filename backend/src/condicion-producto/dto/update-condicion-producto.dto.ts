import { PartialType } from '@nestjs/mapped-types';
import { CreateCondicionProductoDto } from './create-condicion-producto.dto';

export class UpdateCondicionProductoDto extends PartialType(CreateCondicionProductoDto) {}
