import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyUser {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    account: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(4)
    otp: string;
}
