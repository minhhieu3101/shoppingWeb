import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { jwtService } from '../jwts/jwts.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly JwtService: jwtService,
        private cacheService: CacheService,
        private readonly configService: ConfigService,
    ) {}
    async register(user: User): Promise<User> {
        return await this.userService.createUser(user);
    }

    async login(account: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findUserForLogin(account, password);
            const username = user.username;
            const refreshToken = await this.cacheService.get(`users:${username}:refreshToken`);
            const accessToken_old = await this.cacheService.get(`users:${username}:accessToken`);
            if (accessToken_old) {
                this.cacheService.del(`users:${username}:accessToken`);
            }
            const accessToken = await this.JwtService.signToken(
                { username: username },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );
            if (refreshToken) {
                await this.cacheService.set(
                    `users:${username}:accessToken`,
                    user.role,
                    this.configService.get<number>('CACHE_ACCESS_TOKEN_TTL'),
                );
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }

            const newRefreshToken = await this.JwtService.signToken(
                { username: username },
                {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
                },
            );
            await this.cacheService.set(
                `users:${username}:refreshToken`,
                newRefreshToken,
                this.configService.get<number>('CACHE_REFRESH_TOKEN_TTL'),
            );
            await this.cacheService.set(
                `users:${username}:accessToken`,
                user.role,
                this.configService.get<number>('CACHE_ACCESS_TOKEN_TTL'),
            );

            return {
                accessToken: accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (err) {
            throw err;
        }
    }
}
