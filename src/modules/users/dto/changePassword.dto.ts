import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class changePasswordDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}
