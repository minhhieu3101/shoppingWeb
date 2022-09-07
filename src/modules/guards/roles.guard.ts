import { CacheService } from './../cache/cache.service';
import { jwtService } from './../jwts/jwts.service';
import { Role } from '../../commons/enum/roles.enum';
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private JwtService: jwtService, private cacheService: CacheService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        const request = context.switchToHttp().getRequest();
        try {
            const token = request.headers.authorization.replace('Bearer ', '');
            const userId = await this.JwtService.verifyToken(token);
            const userRole = await this.cacheService.get(`users:${userId.id}:accessToken`);
            request.userId = userId.id;
            request.userRole = userRole;
            if (roles.length > 0 && !roles.includes(userRole as Role)) {
                throw new HttpException(
                    `you are ${userRole} . You do not have permission to do this activity`,
                    HttpStatus.NOT_ACCEPTABLE,
                );
            }
            return true;
        } catch (err) {
            throw new HttpException('Can not get the token or You have timed out for login', HttpStatus.BAD_REQUEST);
        }
    }
}
