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
    async register(user: any): Promise<User> {
        try {
            return await this.userService.createUser(user);
        } catch (err) {
            throw err;
        }
    }

    async login(account: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findUserForLogin(account, password);
            const userId = user.id;
            const refreshToken = await this.cacheService.get(`users:${userId}:refreshToken`);
            const accessToken_old = await this.cacheService.get(`users:${userId}:accessToken`);
            if (accessToken_old) {
                this.cacheService.del(`users:${userId}:accessToken`);
            }
            const accessToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );
            if (refreshToken) {
                await this.cacheService.set(
                    `users:${userId}:accessToken`,
                    user.role,
                    this.configService.get<number>('CACHE_ACCESS_TOKEN_TTL'),
                );
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }

            const newRefreshToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
                },
            );
            await this.cacheService.set(
                `users:${userId}:refreshToken`,
                newRefreshToken,
                this.configService.get<number>('CACHE_REFRESH_TOKEN_TTL'),
            );
            await this.cacheService.set(
                `users:${userId}:accessToken`,
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
    async getNewToken(_refreshToken: string): Promise<any> {
        try {
            const userId = (await this.JwtService.verifyToken(_refreshToken)).id;
            const accessToken_old = await this.cacheService.get(`users:${userId}:accessToken`);
            if (accessToken_old) {
                this.cacheService.del(`users:${userId}:accessToken`);
            }
            const accessToken = await this.JwtService.signToken(
                { id: userId },
                {
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                },
            );
            const user = await this.userService.getYourInfo(userId);
            await this.cacheService.set(
                `users:${userId}:accessToken`,
                user.role,
                this.configService.get<number>('CACHE_ACCESS_TOKEN_TTL'),
            );
            return {
                accessToken: accessToken,
            };
        } catch (err) {
            throw err;
        }
    }
}
