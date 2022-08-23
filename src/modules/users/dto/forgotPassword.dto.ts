import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class forgotPasswordDTO {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(4)
    otp: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
