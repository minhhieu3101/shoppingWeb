import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    barcode: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    importPrice: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    exportPrice: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    weight: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    quantityInStock: number;

    @IsString()
    @IsOptional()
    description: string;
}
