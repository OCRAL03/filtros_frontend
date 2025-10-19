import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateArticuloDto {
    @ApiProperty({
        description: 'Id de la categoria',
        example: '1'
    })
    @IsNumber()
    idCategoria: number;

    @ApiProperty({
        description: 'Id de la marca',
        example: '1'
    })
    @IsNumber()
    idMarca: number;

    @ApiProperty({
        description: 'Modelo del producto',
        example: 'POCOX3NFC'
    })
    @IsString()
    modelo: string;

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Poco X3 NFC'
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: 'Stock total de todas las tiendas',
        example: '0'
    })
    @IsNumber()
    stock: number;

    @ApiProperty({
        description: 'Descripción del producto',
        example: '8 RAM 256 ROM'
    })
    @IsString()
    descripcion: string;

    @ApiProperty({
        description: 'Imagen del producto',
        example: 'img.png'
    })
    @IsString()
    imagen: string;

    @ApiProperty({
        description: 'Precio de Compra del producto',
        example: '1000'
    })
    @IsNumber()
    precioCompra: number;

    @ApiProperty({
        description: 'Precio de Vente del producto',
        example: '1200'
    })
    @IsNumber()
    precioVenta: number;

    @ApiProperty({
        description: 'Id de la condicion del producto',
        example: '1'
    })
    @IsNumber()
    idCondicionProducto: number;

    @ApiProperty({
        description: 'Fecha de ingreso',
        example: '2025-09-01'
    })
    @IsString()
    fechaIngreso: string;

    @ApiProperty({
        description: 'Fecha de garantia',
        example: '2025-09-01'
    })
    @IsString()
    garantiaFabrica: string;

    @ApiProperty({
        description: 'Descuento del producto',
        example: '5'
    })
    @IsString()
    descuento: number;

}
