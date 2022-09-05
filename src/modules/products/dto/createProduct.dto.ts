import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    importPrice: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    exportPrice: string;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    weight: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    quantityInStock: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    files: 'img';

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    categoryId: string;
}
