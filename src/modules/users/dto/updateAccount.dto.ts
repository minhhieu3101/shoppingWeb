import { IsDateString, IsString, Length } from 'class-validator';

export class updateAccountDto {
    @IsString()
    fullname: string;

    @IsString()
    @Length(10)
    phoneNumber: string;

    @IsString()
    address: string;

    @IsDateString({}, { each: true })
    dob: Date;
}
