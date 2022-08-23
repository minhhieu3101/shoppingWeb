import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class sendOtpDTO {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}
