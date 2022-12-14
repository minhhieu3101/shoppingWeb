import { getNewTokenDto } from './dto/getNewToken.dto';
import { LoginDto } from './dto/login.dto';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { User } from './../users/users.entity';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/createAccount.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger/dist';
import { Role } from '../../commons/enum/roles.enum';

@ApiTags('Authentication')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiQuery({ name: 'role', enum: Role })
    register(@Body() user: CreateAccountDto): Promise<User> {
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() userLogin: LoginDto): Promise<any> {
        return this.authService.login(userLogin.account, userLogin.password);
    }

    @Post('getToken')
    getNewToken(@Body() refreshToken: getNewTokenDto): Promise<any> {
        return this.authService.getNewToken(refreshToken.refreshToken);
    }
}
