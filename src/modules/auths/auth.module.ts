import { ConfigModule } from '@nestjs/config';
import { jwtModule } from './../jwts/jwts.module';
import { UsersModule } from './../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { cacheModule } from '../cache/cache.module';

@Module({
    imports: [UsersModule, jwtModule, cacheModule, ConfigModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
