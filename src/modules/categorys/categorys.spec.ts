import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { RolesGuard } from './../guards/roles.guard';
import { CategoryRepository } from './categorys.repository';
import { AppModule } from './../../app.module';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './categorys.entity';
import { UploadApiResponse } from 'cloudinary';
import { CategoryStatus } from '../../commons/enum/categorys.enum';

describe('Category', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let cateRepo: CategoryRepository;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();
        cateRepo = testModule.get<CategoryRepository>(CategoryRepository);
        jest.spyOn(testModule.get<CloudinaryService>(CloudinaryService), 'uploadImageToCloudinary').mockResolvedValue(
            {} as UploadApiResponse,
        );

        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('Get category', () => {
        it('get all category admin success', () => {
            jest.spyOn(cateRepo, 'paginate').mockResolvedValue({} as Pagination<Category>);
            return request(app.getHttpServer()).get('/admin/category').expect(200);
        });

        it('get all category user success', () => {
            jest.spyOn(cateRepo, 'paginate').mockResolvedValue({} as Pagination<Category>);
            return request(app.getHttpServer()).get('/user/category').expect(200);
        });
        it('get all category admin success', () => {
            jest.spyOn(cateRepo, 'paginate').mockRejectedValue(new HttpException('', 500));
            return request(app.getHttpServer()).get('/admin/category').expect(500);
        });

        it('get all category user success', () => {
            jest.spyOn(cateRepo, 'paginate').mockRejectedValue(new HttpException('', 500));
            return request(app.getHttpServer()).get('/user/category').expect(500);
        });
        it('get category by id admin success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            return request(app.getHttpServer()).get('/admin/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca').expect(200);
        });

        it('get category by id user success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            return request(app.getHttpServer()).get('/user/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca').expect(200);
        });
        it('get category by id admin success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockRejectedValue(new HttpException('', 500));
            return request(app.getHttpServer()).get('/admin/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca').expect(404);
        });

        it('get category by id user success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockRejectedValue(new HttpException('', 500));
            return request(app.getHttpServer()).get('/user/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca').expect(404);
        });
    });

    describe('Create category', () => {
        it('Create category success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue(null as Category);
            jest.spyOn(cateRepo, 'save').mockResolvedValue({} as Category);
            return request(app.getHttpServer())
                .post('/admin/category')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(201);
        });

        it('Create category fail . Category is exist', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            return request(app.getHttpServer())
                .post('/admin/category')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(400);
        });
    });

    describe('Update category', () => {
        it('Update category success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            jest.spyOn(cateRepo, 'update').mockResolvedValue({});
            return request(app.getHttpServer())
                .patch('/admin/category/update/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(200);
        });

        it('Update category fail . Category is exist', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue(null);
            return request(app.getHttpServer())
                .patch('/admin/category/update/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(404);
        });

        it('Update category fail . Category is exist', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            jest.spyOn(cateRepo, 'getByName').mockResolvedValue({ name: 'ttyrtrtty' } as Category);
            return request(app.getHttpServer())
                .patch('/admin/category/update/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(400);
        });

        it('Update category fail . Category is inactive', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({ status: CategoryStatus.inactive } as Category);
            return request(app.getHttpServer())
                .post('/admin/category')
                .send({
                    name: 'ttyrtrtty',
                    description: 'rgrtrtr',
                    banner: 'dfdfdf',
                })
                .expect(400);
        });
    });

    describe('Delete category', () => {
        it('delete success', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue({} as Category);
            jest.spyOn(cateRepo, 'save').mockResolvedValue({} as Category);
            return request(app.getHttpServer())
                .delete('/admin/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(200);
        });
        it('delete fail. Can not find this category', () => {
            jest.spyOn(cateRepo, 'getByCondition').mockResolvedValue(null as Category);
            return request(app.getHttpServer())
                .delete('/admin/category/2dd80e15-ecad-4fd2-9fae-4b4fe3bfacca')
                .expect(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
