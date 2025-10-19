import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateEstadoArticuloDto {
    @ApiProperty({
        description: 'Estado del articulo',
        example: 1,
        required: true,
    })
    @IsNumber()
    idCondicionProducto: number;
}
