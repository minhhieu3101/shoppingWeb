import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { Role } from '../../../commons/enum/roles.enum';

export class CreateAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(10)
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsDateString({}, { each: true })
    @IsNotEmpty()
    dob: Date;

    @ApiProperty()
    @IsEnum(Role)
    @IsOptional()
    role: Role;
}
