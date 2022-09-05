import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    barcode: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @ApiProperty()
    importPrice: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @ApiProperty()
    exportPrice: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    @ApiProperty()
    weight: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @ApiProperty()
    quantityInStock: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;
}
