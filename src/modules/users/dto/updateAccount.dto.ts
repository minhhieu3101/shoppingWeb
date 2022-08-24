import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class updateAccountDto {
    @IsString()
    @IsOptional()
    fullname: string;

    @IsString()
    @Length(10)
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsDateString({}, { each: true })
    @IsOptional()
    dob: Date;
}
