import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from './../users/users.entity';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/createAccount.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() user: CreateAccountDto): Promise<User> {
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() userLogin: LoginDto): Promise<any> {
        return this.authService.login(userLogin.account, userLogin.password);
    }
}
