import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class updateAccountDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    fullname: string;

    @ApiProperty()
    @IsString()
    @Length(10)
    @IsOptional()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty()
    @IsDateString({}, { each: true })
    @IsOptional()
    dob: Date;
}
