import { IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    quantity: string;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    discount: string;

    @ApiProperty({ default: new Date() })
    @IsDateString()
    @IsNotEmpty()
    begin: string;

    @ApiProperty({ default: new Date() })
    @IsDateString()
    @IsNotEmpty()
    end: string;
}
