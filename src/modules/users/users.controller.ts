import { RolesGuard } from './../guards/roles.guard';
import { updateAccountDto } from './dto/updateAccount.dto';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { VerifyUser } from './dto/verifyUser.dto';
import {
    Body,
    Controller,
    Patch,
    Post,
    Request,
    UseGuards,
    Get,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
    Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { sendOtpDTO } from './dto/sendOTP.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from 'src/commons/enum/roles.enum';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('User')
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

    @Get('/all')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    getAllUser() {
        return this.userService.getAllUser();
    }

    @Get('')
    @Roles()
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getYourInfo(@Request() req) {
        const userId = req.userId;
        return this.userService.getYourInfo(userId);
    }

    @Patch('/change-password')
    @Roles()
    @UseGuards(RolesGuard)
    changePassword(@Body() info: changePasswordDTO, @Request() req) {
        const userId = req.userId;
        return this.userService.changePassword(userId, info.password, info.newPassword);
    }

    @Patch('/update')
    @Roles()
    @UseGuards(RolesGuard)
    updateUser(@Body() info: updateAccountDto, @Request() req) {
        const userId = req.userId;
        return this.userService.updateUser(userId, info);
    }

    @Patch('/grant/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    grantPermission(@Param() params) {
        const userId = params.id;
        return this.userService.grantPermission(userId);
    }

    @Delete('/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    deleteUser(@Param() params) {
        const userId = params.id;
        return this.userService.deleteUser(userId);
    }
}
