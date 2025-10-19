// import { PartialType } from '@nestjs/mapped-types';
import { CreateArticuloDto } from './create-articulo.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateArticuloDto extends PartialType(CreateArticuloDto) {
    @ApiProperty({
        description: 'Estado de la agenda',
        example: false,
        required: true,
    })
    @IsBoolean()
    idCondicionProducto: number;
}
