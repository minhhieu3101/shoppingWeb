import { UserService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    async register(user: User): Promise<User> {
        return this.userService.createUser(user);
    }

    async login(account: string, password: string): Promise<User> {
        return await this.userService.findUserForLogin(account, password);
    }
}
