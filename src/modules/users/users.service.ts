import { SendMailService } from '../sendMail/sendMail.service';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { comparePassword, hashPassword } from 'src/utils/encrypt.utils';
import { Role } from 'src/commons/enum/roles.enum';

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
        try {
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
        } catch (err) {
            throw err;
        }
    }

    async sendOTP(email: string) {
        try {
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
        } catch (err) {
            throw err;
        }
    }

    async forgotPassword(email: string, otp: string, password: string) {
        try {
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
        } catch (err) {
            throw err;
        }
    }

    async getAllUser(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getYourInfo(id: string): Promise<User> {
        return await this.userRepository.getById(id);
    }

    async changePassword(id: string, password: string, newPassword: string) {
        try {
            const user = await this.userRepository.getById(id);
            if (!user) {
                throw new NotFoundException(ERROR.USER_NOT_FOUND);
            }
            if (!(user.password === password)) {
                throw new NotFoundException(ERROR.PASSWORD_INCORRECT);
            }
            user.password = newPassword;
            await this.userRepository.save(user);
            return {
                message: `Change password in account is success `,
            };
        } catch (err) {
            throw err;
        }
    }

    async updateUser(id: string, info: any) {
        if (await this.userRepository.update(id, info)) {
            return await this.userRepository.getById(id);
        }
        throw new UnauthorizedException();
    }

    async grantPermission(id: string) {
        try {
            const user = await this.userRepository.getById(id);
            if (!user) {
                throw new NotFoundException(ERROR.USER_NOT_FOUND);
            }
            if (user.role === Role.admin) {
                throw new UnauthorizedException(ERROR.USER_IS_ADMIN);
            }

            user.role = Role.admin;
            await this.userRepository.save(user);
            return {
                message: `Grant permission is success `,
            };
        } catch (err) {
            throw err;
        }
    }
}
