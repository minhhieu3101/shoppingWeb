import { CouponRepository } from './coupons.repository';
import { AppModule } from './../../app.module';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Coupon } from './coupons.entity';
import { RolesGuard } from '../guards/roles.guard';

describe('Coupon', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let couponRepo: CouponRepository;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();
        couponRepo = testModule.get<CouponRepository>(CouponRepository);
        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('Create coupon', () => {
        it('Create coupon success', () => {
            jest.spyOn(couponRepo, 'getByCondition').mockResolvedValue(null as Coupon);
            jest.spyOn(couponRepo, 'save').mockResolvedValue({} as Coupon);
            return request(app.getHttpServer())
                .post('/admin/coupons')
                .send({
                    name: 'string',
                    quantity: '10',
                    discount: '20',
                    begin: '2022-09-16T01:52:24.168Z',
                    end: '2022-09-30T01:50:24.169Z',
                })
                .expect(201);
        });
        it('Create coupon fail . Coupon begin time is higher than end time', () => {
            return request(app.getHttpServer())
                .post('/admin/coupons')
                .send({
                    name: 'string',
                    quantity: '10',
                    discount: '20',
                    begin: '2022-09-16T01:52:24.168Z',
                    end: '2022-09-16T01:50:24.169Z',
                })
                .expect(400);
        });
        it('Create coupon fail . Coupon end time is lower than date now', () => {
            return request(app.getHttpServer())
                .post('/admin/coupons')
                .send({
                    name: 'string',
                    quantity: '10',
                    discount: '20',
                    begin: '2022-09-16T01:52:24.168Z',
                    end: '2022-09-16T01:58:24.169Z',
                })
                .expect(400);
        });
        it('Create coupon fail . Coupon end time is lower than date now', () => {
            return request(app.getHttpServer())
                .post('/admin/coupons')
                .send({
                    name: 'string',
                    quantity: '-3',
                    discount: '20',
                    begin: '2022-09-16T01:52:24.168Z',
                    end: '2022-09-30T01:50:24.169Z',
                })
                .expect(400);
        });
        it('Create coupon fail . Coupon exist', () => {
            jest.spyOn(couponRepo, 'getByCondition').mockResolvedValue({} as Coupon);
            return request(app.getHttpServer())
                .post('/admin/coupons')
                .send({
                    name: 'string',
                    quantity: '10',
                    discount: '20',
                    begin: '2022-09-16T01:52:24.168Z',
                    end: '2022-09-30T01:50:24.169Z',
                })
                .expect(400);
        });
    });
    describe('Get coupon', () => {
        describe('Get coupons', () => {
            it('get all coupons admin success', () => {
                jest.spyOn(couponRepo, 'paginate').mockResolvedValue({} as Pagination<Coupon>);
                return request(app.getHttpServer()).get('/admin/coupons').expect(200);
            });

            it('get all coupons user success', () => {
                jest.spyOn(couponRepo, 'paginate').mockResolvedValue({} as Pagination<Coupon>);
                return request(app.getHttpServer()).get('/user/coupons').expect(200);
            });
            it('get coupon by id admin success', () => {
                jest.spyOn(couponRepo, 'getById').mockResolvedValue({} as Coupon);
                return request(app.getHttpServer())
                    .get('/admin/coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                    .expect(200);
            });

            it('get coupon by id user success', () => {
                jest.spyOn(couponRepo, 'getByCondition').mockResolvedValue({} as Coupon);
                return request(app.getHttpServer())
                    .get('/user/coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                    .expect(200);
            });
            it('get coupon by id user fail . Not found', () => {
                jest.spyOn(couponRepo, 'getByCondition').mockResolvedValue(null);
                return request(app.getHttpServer())
                    .get('/user/coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                    .expect(404);
            });

            it('get coupon by id user fail . ', () => {
                jest.spyOn(couponRepo, 'getByCondition').mockResolvedValue({
                    begin: '2022-09-30T01:52:24.168Z',
                    end: '2022-09-01T01:50:24.169Z',
                } as Coupon);
                return request(app.getHttpServer())
                    .get('/user/coupons/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                    .expect(400);
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
