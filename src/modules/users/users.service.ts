import { SendMailService } from '../sendMail/sendMail.service';
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
            return this.userRepository.save(user);
        }
        throw new NotFoundException(ERROR.USERNAME_OR_EMAIL_EXISTED);
    }

    async findUserForLogin(account: string, password: string) {
        const user = await this.userRepository.getByCondition({
            where: [{ username: account }, { email: account }],
        });
        if (!user || !(await comparePassword(password, user.password))) {
            throw new UnauthorizedException(ERROR.USERNAME_OR_PASSWORD_INCORRECT);
        }

        if (!user.isActive) {
            throw new UnauthorizedException(ERROR.USER_IS_NOT_VERIFIED);
        }
        return user;
    }

    async verifyUser(account: string, otp: string) {
        const user = await this.userRepository.getByCondition({
            where: [{ username: account }, { email: account }],
        });
        if (!user) {
            throw new NotFoundException(ERROR.USER_NOT_FOUND);
        }
        if (user.isActive) {
            throw new UnauthorizedException(ERROR.USER_IS_VERIFIED);
        }
        if (user.activeCode !== otp) {
            throw new NotFoundException(ERROR.ACTIVECODE_IS_WRONG);
        }
        user.isActive = true;
        await this.userRepository.save(user);
        return {
            message: `Verified account ${account} is success `,
        };
    }

    async sendOTP(email: string) {
        const user = await this.userRepository.getByCondition({
            where: { email: email },
        });
        if (!user) {
            throw new NotFoundException(ERROR.USER_NOT_FOUND);
        }

        user.activeCode = await this.emailService.sendMail(user.email);
        await this.userRepository.save(user);
        return {
            message: `Change forgot password in account ${email} is success `,
        };
    }

    async forgotPassword(email: string, otp: string, password: string) {
        const user = await this.userRepository.getByCondition({
            where: { email: email },
        });
        if (!user) {
            throw new NotFoundException(ERROR.USER_NOT_FOUND);
        }

        if (user.activeCode !== otp) {
            throw new NotFoundException(ERROR.ACTIVECODE_IS_WRONG);
        }
        console.log(user.password);
        user.password = await hashPassword(password);
        console.log(user.password);
        await this.userRepository.save(user);
        return {
            message: `Change forgot password in account ${email} is success `,
        };
    }

    async getAllUser(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async changePassword(password: string, newPassword: string) {
        return {};
    }

    async updateUser(info: any) {
        return {};
    }
}
