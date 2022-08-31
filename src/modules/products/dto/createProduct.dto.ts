import { ProductStatus } from './../../../commons/enum/products.enum';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    barcode: string;

    @IsNumberString()
    @IsNotEmpty()
    importPrice: string;

    @IsNumberString()
    @IsNotEmpty()
    exportPrice: string;

    @IsNumberString()
    @IsOptional()
    weight: string;

    @IsNumberString()
    @IsNotEmpty()
    quantityInStock: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status: ProductStatus;
}
