import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
}
