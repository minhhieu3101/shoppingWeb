import { Product } from './products.entity';
import { Category } from './../categorys/categorys.entity';
import { CategoryService } from './../categorys/categorys.service';
import { Picture } from './../pictures/pictures.entity';
import { PicturesService } from './../pictures/pictures.service';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { RolesGuard } from './../guards/roles.guard';
import { ProductRepository } from './products.repository';
import { AppModule } from './../../app.module';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../../commons/exceptionFilter/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UploadApiResponse } from 'cloudinary';
import { CategoryStatus } from '../../commons/enum/categorys.enum';
import { ProductStatus } from '../../commons/enum/products.enum';

describe('Product', () => {
    let app: INestApplication;
    let testModule: TestingModule;
    let productRepo: ProductRepository;
    let cateService: CategoryService;
    beforeAll(async () => {
        testModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(RolesGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();
        productRepo = testModule.get<ProductRepository>(ProductRepository);
        cateService = testModule.get<CategoryService>(CategoryService);
        jest.spyOn(testModule.get<CloudinaryService>(CloudinaryService), 'uploadImageToCloudinary').mockResolvedValue(
            {} as UploadApiResponse,
        );

        jest.spyOn(testModule.get<PicturesService>(PicturesService), 'createPicture').mockResolvedValue({
            url: 'sadasd',
        } as Picture);

        app = testModule.createNestApplication();
        app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('Create Product', () => {
        it('Create product success', () => {
            jest.spyOn(cateService, 'checkCategoryActive').mockResolvedValue(true);
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            jest.spyOn(cateService, 'getCategoryById').mockResolvedValue({
                id: '5ae92268-3cad-416d-9546-ff19adc27ba5',
                name: 'bep',
                status: CategoryStatus.active,
            } as Category);
            jest.spyOn(productRepo, 'save').mockResolvedValue({} as Product);
            return request(app.getHttpServer())
                .post('/admin/products')
                .type('form')
                .field('name', 'asdasd')
                .field('importPrice', '12')
                .field('exportPrice', '34')
                .field('quantityInStock', '3')
                .field('categoryId', '5ae92268-3cad-416d-9546-ff19adc27ba5')
                .expect(201);
        });
        it('Create product fail . Category is not active', () => {
            jest.spyOn(cateService, 'checkCategoryActive').mockResolvedValue(false);
            return request(app.getHttpServer())
                .post('/admin/products')
                .type('form')
                .field('name', 'asdasd')
                .field('importPrice', '12')
                .field('exportPrice', '34')
                .field('quantityInStock', '3')
                .field('categoryId', '5ae92268-3cad-416d-9546-ff19adc27ba6')
                .expect(400);
        });

        it('Create product fail . product is exist', () => {
            jest.spyOn(cateService, 'checkCategoryActive').mockResolvedValue(true);
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({ name: 'asdasd' } as Product);
            return request(app.getHttpServer())
                .post('/admin/products')
                .type('form')
                .field('name', 'asdasd')
                .field('importPrice', '12')
                .field('exportPrice', '34')
                .field('quantityInStock', '3')
                .field('categoryId', '5ae92268-3cad-416d-9546-ff19adc27ba6')
                .expect(400);
        });
        it('Create product fail . Not found this category', () => {
            jest.spyOn(cateService, 'checkCategoryActive').mockResolvedValue(true);
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            jest.spyOn(cateService, 'getCategoryById').mockResolvedValue(null as Category);
            return request(app.getHttpServer())
                .post('/admin/products')
                .type('form')
                .field('name', 'asdasd')
                .field('importPrice', '12')
                .field('exportPrice', '34')
                .field('quantityInStock', '3')
                .field('categoryId', '5ae92268-3cad-416d-9546-ff19adc27ba5')
                .expect(404);
        });
    });

    describe('Get Product and Image', () => {
        it('Get product by id by user success', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({ name: 'sadasd' } as Product);
            return request(app.getHttpServer()).get('/user/products/123213213').expect(200);
        });
        it('Get product by id by user fail', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            return request(app.getHttpServer()).get('/user/products/123213213').expect(404);
        });
        it('Get product by category by user success', () => {
            jest.spyOn(productRepo, 'paginate').mockResolvedValue({} as Pagination<Product>);
            return request(app.getHttpServer()).get('/user/products/categoryId/123213213').expect(200);
        });
        it('Get all product by user success', () => {
            jest.spyOn(productRepo, 'paginate').mockResolvedValue({} as Pagination<Product>);
            return request(app.getHttpServer()).get('/user/products').expect(200);
        });
        it('Get product image success', () => {
            jest.spyOn(testModule.get<PicturesService>(PicturesService), 'getPicture').mockResolvedValue(
                {} as Pagination<Picture>,
            );
            return request(app.getHttpServer()).get('/products/images/12312312').expect(200);
        });
    });

    describe('Update Product', () => {
        it('Update product success', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({} as Product);
            jest.spyOn(productRepo, 'getByName').mockResolvedValue(null as Product);
            jest.spyOn(productRepo, 'update').mockResolvedValue({});
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .expect(200);
        });
        it('Update product fail . This product name is exist', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({} as Product);
            jest.spyOn(productRepo, 'getByName').mockResolvedValue({ name: 'bep' } as Product);
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .expect(400);
        });
        it('Update product fail . Not found product', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .expect(404);
        });

        it('Update product fail . Import price is higher than export price', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .field('importPrice', '20')
                .field('exportPrice', '10')
                .expect(400);
        });
        it('Update product fail . New export price is lower than old import price', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({ importPrice: 20 } as Product);
            jest.spyOn(productRepo, 'getByName').mockResolvedValue(null as Product);
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .field('exportPrice', '10')
                .expect(400);
        });
        it('Update product fail . New import price is higher than old export price', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({ exportPrice: 30 } as Product);
            jest.spyOn(productRepo, 'getByName').mockResolvedValue(null as Product);
            return request(app.getHttpServer())
                .patch('/admin/products/update/123213213')
                .type('form')
                .field('name', 'bep')
                .field('importPrice', '40')
                .expect(400);
        });
    });

    describe('Delete product', () => {
        it('Delete product success', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({ status: ProductStatus.active } as Product);
            jest.spyOn(productRepo, 'save').mockResolvedValue({} as Product);
            return request(app.getHttpServer()).delete('/admin/products/123213213').expect(200);
        });
        it('Delete product fail . Can not find this product', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue(null as Product);
            return request(app.getHttpServer()).delete('/admin/products/123213213').expect(404);
        });

        it('Delete product fail . this product has been deleted', () => {
            jest.spyOn(productRepo, 'getByCondition').mockResolvedValue({
                status: ProductStatus.unavailable,
            } as Product);
            return request(app.getHttpServer()).delete('/admin/products/123213213').expect(400);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
