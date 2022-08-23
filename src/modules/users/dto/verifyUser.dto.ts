import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyUser {
    @IsNotEmpty()
    @IsString()
    account: string;

    @IsString()
    @IsNotEmpty()
    @Length(4)
    otp: string;
}
