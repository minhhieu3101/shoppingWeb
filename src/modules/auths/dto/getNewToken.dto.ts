import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class getNewTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
