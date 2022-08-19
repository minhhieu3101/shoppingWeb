import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    account: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
