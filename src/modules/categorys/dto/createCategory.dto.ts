import { CategoryStatus } from 'src/commons/enum/categorys.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(CategoryStatus)
    @IsOptional()
    status: CategoryStatus;
}
