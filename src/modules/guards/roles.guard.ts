import { CacheService } from './../cache/cache.service';
import { jwtService } from './../jwts/jwts.service';
import { Role } from 'src/commons/enum/roles.enum';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private JwtService: jwtService, private cacheService: CacheService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return false;
        }
        const username = await this.JwtService.verifyToken(token);
        const userRole = await this.cacheService.get(`users:${username.username}:accessToken`);
        if (!roles.includes(userRole as Role)) {
            return false;
        }
        return true;
    }
}
