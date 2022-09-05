import { ApiProperty } from '@nestjs/swagger';

export class uploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: 'img';
}
