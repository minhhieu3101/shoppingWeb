import { CategoryStatus } from 'src/commons/enum/categorys.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    banner: string;

    @ApiProperty()
    @IsEnum(CategoryStatus)
    @IsOptional()
    status: CategoryStatus;
}
