import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { Role } from '../../../commons/enum/roles.enum';
import { User } from './../../users/users.entity';

export class CreateAccountDto extends User {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    @Length(10)
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsDateString({}, { each: true })
    @IsNotEmpty()
    dob: Date;

    @IsEnum(Role)
    @IsOptional()
    role: Role;
}
