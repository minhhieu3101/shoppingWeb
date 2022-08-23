import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class jwtService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
    async signToken(payload: object, expireTime: object): Promise<string> {
        return this.jwtService.signAsync(payload, expireTime);
    }
    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });
    }
}
