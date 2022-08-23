import { RolesGuard } from './../guards/roles.guard';
import { updateAccountDto } from './dto/updateAccount.dto';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { VerifyUser } from './dto/verifyUser.dto';
import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { sendOtpDTO } from './dto/sendOTP.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from 'src/commons/enum/roles.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/verify')
    verifyAccount(@Body() info: VerifyUser) {
        return this.userService.verifyUser(info.account, info.otp);
    }

    @Post('/sendOTP')
    sendOTP(@Body() info: sendOtpDTO) {
        return this.userService.sendOTP(info.email);
    }

    @Patch('/forgot-password')
    forgotPassword(@Body() info: forgotPasswordDTO) {
        return this.userService.forgotPassword(info.email, info.otp, info.password);
    }

    @Patch('/change-password/:id')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    changePassword(@Body() info: changePasswordDTO, @Request() req) {
        return this.userService.changePassword(info.password, info.newPassword);
    }

    @Patch('/update')
    @Roles(Role.user)
    @UseGuards(RolesGuard)
    updateUser(@Body() info: updateAccountDto) {
        return this.userService.updateUser(info);
    }
}
