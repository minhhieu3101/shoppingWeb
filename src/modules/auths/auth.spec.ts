import { UserRepository } from './../users/users.repository';
import { SendMailService } from './../sendMail/sendMail.service';
import { AppModule } from './../../app.module';
import { UserService } from './../users/users.service';
import { UserStatus } from './../../commons/enum/users.enum';
import { User } from './../users/users.entity';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { CacheService } from '../cache/cache.service';
import { jwtService } from '../jwts/jwts.service';
import { ERROR } from '../../commons/errorHandling/errorHandling';

describe('Authentication', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let userService: UserService;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        userService = testModule.get<UserService>(UserService);
        jest.spyOn(testModule.get<CacheService>(CacheService), 'get').mockResolvedValue('token');
        jest.spyOn(testModule.get<CacheService>(CacheService), 'set').mockResolvedValue();
        jest.spyOn(testModule.get<CacheService>(CacheService), 'del').mockResolvedValue();
        jest.spyOn(testModule.get<jwtService>(jwtService), 'signToken').mockResolvedValue('token');
        jest.spyOn(testModule.get<jwtService>(jwtService), 'verifyToken').mockResolvedValue('payload');
        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('Login', () => {
        it('login success', () => {
            const input = new User();
            input.username = 'mh31013101';
            input.password = 'mh31013101';
            input.status = UserStatus.active;
            jest.spyOn(userService, 'findUserForLogin').mockResolvedValue(input as User);
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mh31013101',
                    password: 'mh31013101',
                })
                .expect(201);
        });

        it('login fail. Not find this account ', () => {
            jest.spyOn(userService, 'findUserForLogin').mockRejectedValue(
                new HttpException(
                    ERROR.USERNAME_OR_PASSWORD_INCORRECT.message,
                    ERROR.USERNAME_OR_PASSWORD_INCORRECT.statusCode,
                ),
            );
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mh31013101',
                    password: 'mh31013101',
                })
                .expect(400);
        });

        it('login fail. Account is invalid ', () => {
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mh',
                    password: 'mh31013101',
                })
                .expect(400);
        });
        it('login fail. Password is invalid ', () => {
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mhsadasd',
                    password: 'mh',
                })
                .expect(400);
        });

        it('login fail. Password is wrong ', () => {
            jest.spyOn(userService, 'findUserForLogin').mockRejectedValue(
                new HttpException(
                    ERROR.USERNAME_OR_PASSWORD_INCORRECT.message,
                    ERROR.USERNAME_OR_PASSWORD_INCORRECT.statusCode,
                ),
            );
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mhsadasd',
                    password: 'mh31013101',
                })
                .expect(400);
        });
        it('login fail. User is not active ', () => {
            jest.spyOn(userService, 'findUserForLogin').mockRejectedValue(
                new HttpException(ERROR.USER_IS_NOT_VERIFIED.message, ERROR.USER_IS_NOT_VERIFIED.statusCode),
            );
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mhsadasd',
                    password: 'mh31013101',
                })
                .expect(400);
        });
        it('login fail. User has been deleted', () => {
            jest.spyOn(userService, 'findUserForLogin').mockRejectedValue(
                new HttpException(ERROR.USER_IS_DELETED.message, ERROR.USER_IS_DELETED.statusCode),
            );
            return request(app.getHttpServer())
                .post('/login')
                .send({
                    account: 'mhsadasd',
                    password: 'mh31013101',
                })
                .expect(400);
        });
    });

    describe('Register', () => {
        it('register success', () => {
            const input = new User();
            input.username = 'mh31013101';
            input.password = 'mh31013101';
            input.email = 'mhdada@gmail.com';
            input.activeCode = '1234';
            jest.spyOn(testModule.get<UserRepository>(UserRepository), 'checkUserExist').mockResolvedValue(
                null as User,
            );
            jest.spyOn(testModule.get<SendMailService>(SendMailService), 'sendMail').mockResolvedValue('1234');
            jest.spyOn(userService, 'createUser').mockResolvedValue(input as User);

            return request(app.getHttpServer())
                .post('/register')
                .send({
                    username: 'mh31013101',
                    password: 'mh31013101',
                    email: 'mhdada@gmail.com',
                    fullname: 'sadasd',
                    phoneNumber: '1234567890',
                    address: 'sdasdasdas',
                    dob: '2001-01-01',
                })
                .expect(201);
        });

        it('Register fail. This account is exist ', () => {
            const input = new User();
            input.username = 'mh31013101';
            input.password = 'mh31013101';
            input.email = 'mhdada@gmail.com';
            jest.spyOn(userService, 'createUser').mockRejectedValue(
                new HttpException(ERROR.USERNAME_OR_EMAIL_EXISTED.message, ERROR.USERNAME_OR_EMAIL_EXISTED.statusCode),
            );
            return request(app.getHttpServer()).post('/register').send(input).expect(400);
        });
        it('Register fail. Username is too short ', () => {
            const input = new User();
            input.username = 'mh';
            input.password = 'mh31013101';
            input.email = 'mhdada@gmail.com';
            return request(app.getHttpServer()).post('/register').send(input).expect(400);
        });
        it('Register fail. Email must be type email ', () => {
            const input = new User();
            input.username = 'mh31013101';
            input.password = 'mh31013101';
            input.email = 'mhdada';
            return request(app.getHttpServer()).post('/register').send(input).expect(400);
        });
    });

    describe('Get New Token', () => {
        it('get token success', () => {
            const input = new User();
            input.username = 'mh31013101';
            input.password = 'mh31013101';
            input.email = 'mhdada@gmail.com';
            jest.spyOn(userService, 'getYourInfo').mockResolvedValue(input as User);

            return request(app.getHttpServer())
                .post('/getToken')
                .send({
                    refreshToken: 'token',
                })
                .expect(201);
        });

        it('get user info fail', () => {
            jest.spyOn(userService, 'getYourInfo').mockResolvedValue(null as User);

            return request(app.getHttpServer())
                .post('/getToken')
                .send({
                    refreshToken: 'token',
                })
                .expect(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
