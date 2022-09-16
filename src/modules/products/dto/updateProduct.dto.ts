import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    barcode: string;

    @IsNumberString()
    @IsOptional()
    @Min(0)
    @ApiProperty({ required: false })
    importPrice: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @ApiProperty({ required: false })
    exportPrice: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    @ApiProperty({ required: false })
    weight: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @ApiProperty({ required: false })
    quantityInStock: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description: string;
}
