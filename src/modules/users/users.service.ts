import { SendMailService } from './../../utils/sendMail/sendMail.service';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { comparePassword, hashPassword } from 'src/utils/encrypt.utils';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly emailService: SendMailService) {}

    async createUser(user: User): Promise<User> {
        const userCheck = await this.userRepository.checkUserExist(user.username, user.email);
        if (!userCheck) {
            user.password = await hashPassword(user.password);
            user.activeCode = await this.emailService.sendMail(user.email);
            console.log(user.activeCode);
            return this.userRepository.create(user);
        }
        throw new NotFoundException(ERROR.USERNAME_OR_EMAIL_EXISTED);
    }

    async findUserForLogin(account: string, password: string): Promise<User> {
        const user = await this.userRepository.getByCondition({
            where: [{ username: account }, { email: account }],
        });
        if (!user || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedException(ERROR.USERNAME_OR_PASSWORD_INCORRECT);
        }
        return user;
    }
}
