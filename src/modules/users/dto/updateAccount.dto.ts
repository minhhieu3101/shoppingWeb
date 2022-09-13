import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class updateAccountDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullname: string;

    @ApiProperty({ required: false })
    @IsString()
    @Length(10)
    @IsOptional()
    phoneNumber: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty({ required: false })
    @IsDateString({}, { each: true })
    @IsOptional()
    dob: Date;
}
