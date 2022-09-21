import { UserCouponRepository } from './user-coupon.repository';
import { UserRepository } from '../users/users.repository';
import { CouponsService } from '../coupons/coupons.service';
import { AppModule } from './../../app.module';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserCoupon } from './user-coupon.entity';
import { RolesGuard } from '../guards/roles.guard';
import { Coupon } from '../coupons/coupons.entity';
import { User } from '../users/users.entity';

describe('User-Coupon', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let userCouponRepo: UserCouponRepository;
    let userRepo: UserRepository;
    let couponService: CouponsService;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();
        userCouponRepo = testModule.get<UserCouponRepository>(UserCouponRepository);
        userRepo = testModule.get<UserRepository>(UserRepository);
        couponService = testModule.get<CouponsService>(CouponsService);
        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('Create user coupon', () => {
        it('Create user coupon success', () => {
            jest.spyOn(couponService, 'getCouponById').mockResolvedValue({} as Coupon);
            jest.spyOn(userCouponRepo, 'getByCondition').mockResolvedValue(null as UserCoupon);
            jest.spyOn(userRepo, 'getById').mockResolvedValue({} as User);
            jest.spyOn(userCouponRepo, 'save').mockResolvedValue({} as UserCoupon);
            return request(app.getHttpServer())
                .post('/user/user-coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(201);
        });
        it('Create user coupon fail . Can not find this coupon', () => {
            jest.spyOn(couponService, 'getCouponById').mockRejectedValue(
                new HttpException('Can not find this coupon', HttpStatus.NOT_FOUND),
            );
            return request(app.getHttpServer())
                .post('/user/user-coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Create user coupon fail . Can not find this coupon', () => {
            jest.spyOn(couponService, 'getCouponById').mockRejectedValue(
                new HttpException('Coupon is out of date', HttpStatus.BAD_REQUEST),
            );
            return request(app.getHttpServer())
                .post('/user/user-coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(HttpStatus.BAD_REQUEST);
        });
        it('Create user coupon fail. You have saved this coupon', () => {
            jest.spyOn(couponService, 'getCouponById').mockResolvedValue({} as Coupon);
            jest.spyOn(userCouponRepo, 'getByCondition').mockResolvedValue({} as UserCoupon);
            return request(app.getHttpServer())
                .post('/user/user-coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(400);
        });
        it('Create user coupon fail . Can not find this user', () => {
            jest.spyOn(couponService, 'getCouponById').mockResolvedValue({} as Coupon);
            jest.spyOn(userCouponRepo, 'getByCondition').mockResolvedValue(null as UserCoupon);
            jest.spyOn(userRepo, 'getById').mockResolvedValue(null as User);
            return request(app.getHttpServer())
                .post('/user/user-coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(404);
        });
    });
    describe('Get user coupon', () => {
        it('get user coupons fail . This user do not have any coupon', () => {
            jest.spyOn(userCouponRepo, 'paginate').mockResolvedValue({} as Pagination<UserCoupon>);
            return request(app.getHttpServer()).get('/user/user-coupons').expect(400);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
