import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from './../users/users.entity';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/createAccount.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() user: CreateAccountDto): Promise<User> {
        return await this.authService.register(user);
    }

    @Post('login')
    async login(@Body() userLogin: LoginDto): Promise<User> {
        return await this.authService.login(userLogin.account, userLogin.password);
    }
}
