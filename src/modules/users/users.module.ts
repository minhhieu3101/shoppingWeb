import { SendMailModule } from './../../utils/sendMail/sendMail.module';
import { UserRepository } from './users.repository';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), SendMailModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService],
})
export class UsersModule {}
