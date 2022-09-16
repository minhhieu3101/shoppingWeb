import { SendMailService } from '../sendMail/sendMail.service';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { comparePassword, hashPassword } from '../../utils/encrypt.utils';
import { Role } from '../../commons/enum/roles.enum';
import { UserStatus } from '../../commons/enum/users.enum';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Not } from 'typeorm';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly emailService: SendMailService) {}

    async createUser(user: any): Promise<User> {
        const userCheck = await this.userRepository.checkUserExist(user.username, user.email);
        if (!userCheck || userCheck.status === UserStatus.deleted) {
            user.password = await hashPassword(user.password);
            user.activeCode = await this.emailService.sendMail(user.email);
            return this.userRepository.save(user);
        }
        throw new HttpException(ERROR.USERNAME_OR_EMAIL_EXISTED.message, ERROR.USERNAME_OR_EMAIL_EXISTED.statusCode);
    }

    async findUserForLogin(account: string, password: string) {
        const user = await this.userRepository.getByCondition({
            where: [{ username: account }, { email: account }],
        });
        if (!user || !(await comparePassword(password, user.password))) {
            throw new HttpException(
                ERROR.USERNAME_OR_PASSWORD_INCORRECT.message,
                ERROR.USERNAME_OR_PASSWORD_INCORRECT.statusCode,
            );
        }
        if (user.status === UserStatus.inactive) {
            throw new HttpException(ERROR.USER_IS_NOT_VERIFIED.message, ERROR.USER_IS_NOT_VERIFIED.statusCode);
        }
        if (user.status === UserStatus.deleted) {
            throw new HttpException(ERROR.USER_IS_DELETED.message, ERROR.USER_IS_DELETED.statusCode);
        }

        return user;
    }

    async verifyUser(account: string, otp: string) {
        try {
            const user = await this.userRepository.getByCondition({
                where: [{ username: account }, { email: account }],
            });
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (user.status === UserStatus.active) {
                throw new HttpException(ERROR.USER_IS_VERIFIED.message, ERROR.USER_IS_VERIFIED.statusCode);
            }
            if (user.status === UserStatus.deleted) {
                throw new HttpException(ERROR.USER_IS_DELETED.message, ERROR.USER_IS_DELETED.statusCode);
            }
            if (user.activeCode !== otp) {
                throw new HttpException(ERROR.ACTIVECODE_IS_WRONG.message, ERROR.ACTIVECODE_IS_WRONG.statusCode);
            }
            user.status = UserStatus.active;
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
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (user.status === UserStatus.deleted) {
                throw new HttpException(ERROR.USER_IS_DELETED.message, ERROR.USER_IS_DELETED.statusCode);
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
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (user.status === UserStatus.deleted) {
                throw new HttpException(ERROR.USER_IS_DELETED.message, ERROR.USER_IS_DELETED.statusCode);
            }

            if (user.activeCode !== otp) {
                throw new HttpException(ERROR.ACTIVECODE_IS_WRONG.message, ERROR.ACTIVECODE_IS_WRONG.statusCode);
            }
            user.password = await hashPassword(password);
            await this.userRepository.save(user);
            return {
                message: `Change forgot password in account ${email} is success `,
            };
        } catch (err) {
            throw err;
        }
    }

    async getAllUser(options: IPaginationOptions): Promise<Pagination<User>> {
        try {
            return await this.userRepository.paginate(options);
        } catch (err) {
            throw err;
        }
    }

    async getYourInfo(id: string): Promise<User> {
        return await this.userRepository.getById(id);
    }

    async changePassword(id: string, password: string, newPassword: string) {
        try {
            const user = await this.userRepository.getByCondition({
                where: {
                    id: id,
                    status: Not(UserStatus.deleted),
                },
            });
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (!(user.password === password)) {
                throw new HttpException(ERROR.PASSWORD_INCORRECT.message, ERROR.PASSWORD_INCORRECT.statusCode);
            }
            user.password = newPassword;
            user.updatedAt = new Date();
            await this.userRepository.save(user);
            return {
                message: `Change password in account is success `,
            };
        } catch (err) {
            throw err;
        }
    }

    async updateUser(id: string, info: any) {
        try {
            return await this.userRepository.update(id, info);
        } catch (err) {
            throw new HttpException('Update Failed', HttpStatus.BAD_REQUEST);
        }
    }

    async grantPermission(id: string) {
        try {
            const user = await this.userRepository.getByCondition({
                where: {
                    id: id,
                    status: Not(UserStatus.deleted),
                },
            });
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (user.role === Role.admin) {
                throw new HttpException(ERROR.USER_IS_ADMIN.message, ERROR.USER_IS_ADMIN.statusCode);
            }
            user.role = Role.admin;
            user.updatedAt = new Date();
            await this.userRepository.save(user);
            return {
                message: `Grant permission is success `,
            };
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.userRepository.getByCondition({
                where: {
                    id: id,
                    status: Not(UserStatus.deleted),
                },
            });
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            if (user.role === Role.admin) {
                throw new HttpException(ERROR.USER_IS_ADMIN.message, ERROR.USER_IS_ADMIN.statusCode);
            }
            user.status = UserStatus.deleted;
            user.updatedAt = new Date();
            await this.userRepository.save(user);
            return {
                message: `Deleted user is success `,
            };
        } catch (err) {
            console.log(err);

            throw err;
        }
    }
}
