import { User } from './users.entity';
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
    Query,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { sendOtpDTO } from './dto/sendOTP.dto';
import { changePasswordDTO } from './dto/changePassword.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from 'src/commons/enum/roles.enum';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger/dist';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('User')
@Controller('')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/user/verify')
    verifyAccount(@Body() info: VerifyUser) {
        return this.userService.verifyUser(info.account, info.otp);
    }

    @Post('/user/sendOTP')
    sendOTP(@Body() info: sendOtpDTO) {
        return this.userService.sendOTP(info.email);
    }

    @Patch('/user/forgot-password')
    forgotPassword(@Body() info: forgotPasswordDTO) {
        return this.userService.forgotPassword(info.email, info.otp, info.password);
    }

    @Get('admin/user')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    getAllUser(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    ): Promise<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        return this.userService.getAllUser({
            page,
            limit,
            route: 'http://localhost:3000/admin/user',
        });
    }

    @Get('/user')
    @Roles()
    @UseGuards(RolesGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBearerAuth()
    getYourInfo(@Request() req) {
        const userId = req.userId;
        return this.userService.getYourInfo(userId);
    }

    @Patch('/user/change-password')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    changePassword(@Body() info: changePasswordDTO, @Request() req) {
        const userId = req.userId;
        return this.userService.changePassword(userId, info.password, info.newPassword);
    }

    @Patch('/user/update')
    @Roles()
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    updateUser(@Body() info: updateAccountDto, @Request() req) {
        const userId = req.userId;
        return this.userService.updateUser(userId, info);
    }

    @Patch('/admin/user/grant/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiParam({
        name: 'id',
    })
    @ApiBearerAuth()
    grantPermission(@Param() params) {
        const userId = params.id;
        return this.userService.grantPermission(userId);
    }

    @Delete('/admin/user/:id')
    @Roles(Role.admin)
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
    })
    deleteUser(@Param() params) {
        const userId = params.id;
        return this.userService.deleteUser(userId);
    }
}
