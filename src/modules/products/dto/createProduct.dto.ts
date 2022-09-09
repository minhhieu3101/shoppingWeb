import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
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
    @IsOptional()
    files: 'img';

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
}
