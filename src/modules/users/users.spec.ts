import { RolesGuard } from './../guards/roles.guard';
import { UserRepository } from './../users/users.repository';
import { AppModule } from './../../app.module';
import { UserStatus } from './../../commons/enum/users.enum';
import { User } from './../users/users.entity';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { SendMailService } from '../sendMail/sendMail.service';
import { Role } from '../../commons/enum/roles.enum';

describe('User', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let userRepo: UserRepository;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();
        userRepo = testModule.get<UserRepository>(UserRepository);

        jest.spyOn(testModule.get<SendMailService>(SendMailService), 'sendMail').mockResolvedValue('1234');
        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });
    const input = new User();
    input.username = 'mh31013101';
    input.password = 'mh31013101';
    input.email = 'mh3101@gmail.com';
    input.fullname = 'sadasd';
    input.dob = new Date();
    input.address = 'asdasdasd';
    input.phoneNumber = '1234567890';
    input.activeCode = '1234';

    describe('Verify', () => {
        it('Verify user success', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            jest.spyOn(userRepo, 'save').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .post('/user/verify')
                .send({
                    account: 'mh31013101',
                    otp: '1234',
                })
                .expect(201);
        });

        it('Verify user fail . Can not find this account', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer())
                .post('/user/verify')
                .send({
                    account: 'mh31012',
                    otp: '1234',
                })
                .expect(404);
        });

        it('Verify user fail . Account has been actived', async () => {
            input.status = UserStatus.active;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input);
            return request(app.getHttpServer())
                .post('/user/verify')
                .send({
                    account: 'mh31013101',
                    otp: '1234',
                })
                .expect(400);
        });

        it('Verify user fail . Account has been deleted', () => {
            input.status = UserStatus.deleted;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input);
            return request(app.getHttpServer())
                .post('/user/verify')
                .send({
                    account: 'mh31013101',
                    otp: '1234',
                })
                .expect(400);
        });

        it('Verify user fail . Active code is wrong', () => {
            input.status = UserStatus.inactive;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .post('/user/verify')
                .send({
                    account: 'mh31013101',
                    otp: '2233',
                })
                .expect(400);
        });
    });

    describe('Send OTP', () => {
        input.status = UserStatus.inactive;
        it('Send OTP success', () => {
            input.activeCode = '';
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            input.activeCode = '1234';
            jest.spyOn(userRepo, 'save').mockResolvedValue(input);
            return request(app.getHttpServer())
                .post('/user/sendOTP')
                .send({
                    email: 'mh3101@gmail.com',
                })
                .expect(201);
        });

        it('Send OTP fail . Can not find this email', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer())
                .post('/user/sendOTP')
                .send({
                    email: 'mh3101@gmail.com',
                })
                .expect(404);
        });

        it('Send OTP fail . Email is not invalid', () => {
            return request(app.getHttpServer())
                .post('/user/sendOTP')
                .send({
                    email: 'mh3101gg',
                })
                .expect(400);
        });

        it('Send OTP fail . This user has been deleted', () => {
            input.status = UserStatus.deleted;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .post('/user/sendOTP')
                .send({
                    email: 'mh3101@gmail.com',
                })
                .expect(400);
        });
    });

    describe('Forgot password', () => {
        it('Change forgot password success', () => {
            input.status = UserStatus.inactive || UserStatus.active;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            jest.spyOn(userRepo, 'save').mockResolvedValue(input);
            return request(app.getHttpServer())
                .patch('/user/forgot-password')
                .send({
                    email: 'mh3101@gmail.com',
                    otp: '1234',
                    password: 'mh31013101',
                })
                .expect(200);
        });

        it('Change forgot password fail . Can not find this email', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer())
                .patch('/user/forgot-password')
                .send({
                    email: 'mh3101@gmail.com',
                    otp: '1234',
                    password: 'mh31013101',
                })
                .expect(404);
        });

        it('Change forgot password fail . Email is invalid', () => {
            return request(app.getHttpServer())
                .patch('/user/forgot-password')
                .send({
                    email: 'mh3101ss',
                    otp: '1234',
                    password: 'mh31013101',
                })
                .expect(400);
        });

        it('Change forgot password fail . This user has been deleted', () => {
            input.status = UserStatus.deleted;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .patch('/user/forgot-password')
                .send({
                    email: 'mh3101@gmail.com',
                    otp: '1234',
                    password: 'mh31013101',
                })
                .expect(400);
        });

        it('Change forgot password fail . This user has been deleted', () => {
            input.status = UserStatus.inactive || UserStatus.active;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .patch('/user/forgot-password')
                .send({
                    email: 'mh3101@gmail.com',
                    otp: '1111',
                    password: 'mh31013101',
                })
                .expect(400);
        });
    });

    describe('Change password', () => {
        it('Change password success', () => {
            input.status = UserStatus.active;
            input.password = 'mh31013101';
            const newPass = 'mh310131';
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .patch('/user/change-password')
                .send({
                    password: 'mh31013101',
                    newPassword: newPass,
                })
                .expect(200);
        });

        it('Change password fail . Can not find this user', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer())
                .patch('/user/change-password')
                .send({
                    password: 'mh31013101',
                    newPassword: 'asdasd',
                })
                .expect(404);
        });

        it('Change password fail . Password and newPassword are too short', () => {
            return request(app.getHttpServer())
                .patch('/user/change-password')
                .send({
                    password: 'asda',
                    newPassword: 'asd',
                })
                .expect(400);
        });

        it('Change password fail . Password is incorrect', () => {
            input.status = UserStatus.active;
            input.password = 'mh31013101';
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .patch('/user/change-password')
                .send({
                    password: 'sadasd',
                    newPassword: 'asdasdasd',
                })
                .expect(400);
        });
    });

    describe('Update user', () => {
        it('Update user success', () => {
            input.status = UserStatus.active;
            input.fullname = 'asdasdasd';
            jest.spyOn(userRepo, 'update').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .patch('/user/update')
                .send({
                    fullname: 'asdasdasd',
                })
                .expect(200);
        });

        it('Update user fail', () => {
            jest.spyOn(userRepo, 'update').mockRejectedValue(new HttpException('', 500));
            return request(app.getHttpServer())
                .patch('/user/update')
                .send({
                    fullname: 'asdasdasd',
                })
                .expect(400);
        });
    });

    describe('Get user', () => {
        it('Get user success', () => {
            input.status = UserStatus.active;
            input.fullname = 'asdasdasd';
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer()).get('/user').expect(200);
        });
    });

    describe('Grant user', () => {
        it('Grant user success', () => {
            input.status = UserStatus.active || UserStatus.inactive;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer()).patch('/admin/user/grant/123123123123').expect(200);
        });
        it('Grant user fail . Can not find this user', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer()).patch('/admin/user/grant/123123123123').expect(404);
        });
        it('Grant user fail . User is admin', () => {
            input.role = Role.admin;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer()).patch('/admin/user/grant/123123123123').expect(400);
        });
    });

    describe('Delete user', () => {
        it('Delete user success', () => {
            input.status = UserStatus.active || UserStatus.inactive;
            input.role = Role.user;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer()).delete('/admin/user/123123123123').expect(200);
        });
        it('Delete user fail . Can not find this user', () => {
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(null as User);
            return request(app.getHttpServer()).delete('/admin/user/123123123123').expect(404);
        });
        it('Delete user fail . User is admin', () => {
            input.role = Role.admin;
            jest.spyOn(userRepo, 'getByCondition').mockResolvedValue(input as User);
            return request(app.getHttpServer()).delete('/admin/user/123123123123').expect(400);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
