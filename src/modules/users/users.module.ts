import { jwtModule } from './../jwts/jwts.module';
import { SendMailModule } from '../sendMail/sendMail.module';
import { UserRepository } from './users.repository';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { cacheModule } from '../cache/cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), SendMailModule, jwtModule, cacheModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserRepository],
})
export class UsersModule {}
