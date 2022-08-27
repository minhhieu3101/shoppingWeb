import { ProductStatus } from './../../../commons/enum/products.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    barcode: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    importPrice: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    exportPrice: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    weight: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    quantityInStock: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status: ProductStatus;
}
