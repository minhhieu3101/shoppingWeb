import { Picture } from './../pictures/pictures.entity';
import { PicturesService } from './../pictures/pictures.service';
import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ProductStatus } from './../../commons/enum/products.enum';
import { Role } from './../../commons/enum/roles.enum';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { CategoryService } from './../categorys/categorys.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Product } from './products.entity';
import { ProductRepository } from './products.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Not } from 'typeorm';
@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryService: CategoryService,
        private readonly pictureService: PicturesService,
    ) {}

    async createProduct(productInfo: any, files: Express.Multer.File[]): Promise<Product> {
        try {
            if (
                (productInfo.quantityInStock as number) < 0 ||
                (productInfo.importPrice as number) < 0 ||
                (productInfo.exportPrice as number) < 0 ||
                (productInfo.weight as number) < 0
            ) {
                throw new HttpException(
                    'Quantity or importPrice or exportPrice or weight is less than 0',
                    HttpStatus.BAD_REQUEST,
                );
            }
            if ((productInfo.importPrice as number) > (productInfo.exportPrice as number)) {
                throw new HttpException('Import price is higher than export price', HttpStatus.BAD_REQUEST);
            }
            const categoryId = productInfo.categoryId;
            const category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                throw new HttpException(ERROR.CATEGORY_NOT_FOUND.message, ERROR.CATEGORY_NOT_FOUND.statusCode);
            }
            if (productInfo.importPrice > productInfo.exportPrice) {
                throw new HttpException('Import price is higher than export price', HttpStatus.BAD_REQUEST);
            }
            const currentProduct = await this.productRepository.getByCondition({
                where: {
                    name: productInfo.name,
                    status: Not(ProductStatus.unavailable),
                    categoryId: {
                        id: categoryId,
                        status: CategoryStatus.active,
                    },
                },
            });
            if (currentProduct) {
                throw new HttpException('This product name is existed in category', HttpStatus.BAD_REQUEST);
            }
            productInfo.categoryId = category;
            if (productInfo.quantityInStock === '0') {
                productInfo.status = ProductStatus.outOfStock;
            }
            const product = await this.productRepository.save(productInfo);
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    await this.pictureService.createPicture(files[i], product);
                }
            }
            return product;
        } catch (err) {
            console.log(err);

            throw err;
        }
    }

    async getAllProduct(options: IPaginationOptions, role: Role): Promise<Pagination<Product>> {
        try {
            if (role === Role.admin) {
                return await this.productRepository.paginate(options);
            }
            const queryBuilder = this.productRepository
                .getRepository()
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.categoryId', 'cate')
                .where('cate.status = :active AND p.status != :unavailable', {
                    active: CategoryStatus.active,
                    unavailable: ProductStatus.unavailable,
                });
            return await this.productRepository.paginate(options, queryBuilder);
        } catch (err) {
            throw err;
        }
    }

    async getProductById(id: string, role: Role): Promise<Product> {
        try {
            if (role === Role.admin) {
                return await this.productRepository.getById(id);
            }
            const product = await this.productRepository.getByCondition({
                where: {
                    categoryId: {
                        status: CategoryStatus.active,
                    },
                    id: id,
                    status: Not(ProductStatus.unavailable),
                },
            });
            if (!product) {
                throw new HttpException(ERROR.PRODUCT_NOT_FOUND.message, ERROR.PRODUCT_NOT_FOUND.statusCode);
            }
            return product;
        } catch (err) {
            throw err;
        }
    }

    async getAllProductByCategory(
        options: IPaginationOptions,
        categoryId: string,
        role: Role,
    ): Promise<Pagination<Product>> {
        try {
            if (role === Role.admin) {
                const queryBuilder = this.productRepository
                    .getRepository()
                    .createQueryBuilder('p')
                    .leftJoinAndSelect('p.categoryId', 'cate')
                    .where('cate.id = :id', {
                        id: categoryId,
                    });
                return await this.productRepository.paginate(options, queryBuilder);
            }
            const category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                throw new HttpException('Not found this category', HttpStatus.NOT_FOUND);
            }

            const queryBuilder = this.productRepository
                .getRepository()
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.categoryId', 'cate')
                .where('cate.status = :active AND p.status != :unavailable AND cate.id = :id', {
                    active: CategoryStatus.active,
                    unavailable: ProductStatus.unavailable,
                    id: categoryId,
                });
            return await this.productRepository.paginate(options, queryBuilder);
        } catch (err) {
            throw err;
        }
    }

    async getImageProduct(options: IPaginationOptions, productId: string): Promise<Pagination<Picture>> {
        try {
            return await this.pictureService.getPicture(options, productId);
        } catch (err) {
            throw err;
        }
    }

    async updateProduct(id: string, productInfo: any): Promise<Product> {
        try {
            if (
                productInfo.importPrice &&
                productInfo.exportPrice &&
                productInfo.importPrice > productInfo.exportPrice
            ) {
                throw new HttpException('Import price is higher than export price', HttpStatus.BAD_REQUEST);
            }
            const product = await this.productRepository.getByCondition({
                where: {
                    id: id,
                    categoryId: {
                        status: CategoryStatus.active,
                    },
                },
            });
            if (!product) {
                throw new HttpException(ERROR.PRODUCT_NOT_FOUND.message, ERROR.PRODUCT_NOT_FOUND.statusCode);
            }
            if (await this.productRepository.getByName(productInfo.name)) {
                throw new HttpException('This product name is existed', HttpStatus.BAD_REQUEST);
            }
            if (productInfo.importPrice && !productInfo.exportPrice && productInfo.importPrice > product.exportPrice) {
                throw new HttpException('New import price is higher than old export price', HttpStatus.BAD_REQUEST);
            }
            if (productInfo.exportPrice && !productInfo.importPrice && productInfo.exportPrice < product.importPrice) {
                throw new HttpException('New export price is lower than old import price', HttpStatus.BAD_REQUEST);
            }
            productInfo.updatedAt = new Date();
            return await this.productRepository.update(id, productInfo);
        } catch (err) {
            throw err;
        }
    }

    async changeProductStatus(id: string, status: ProductStatus): Promise<any> {
        try {
            const product = await this.productRepository.getByCondition({
                where: {
                    id: id,
                    categoryId: {
                        status: CategoryStatus.active,
                    },
                },
            });
            if (!product) {
                throw new HttpException(ERROR.PRODUCT_NOT_FOUND.message, ERROR.PRODUCT_NOT_FOUND.statusCode);
            }
            if (product.status === status) {
                throw new HttpException(`This product is ${status} already`, HttpStatus.BAD_REQUEST);
            }
            product.status = status;
            product.updatedAt = new Date();
            await this.productRepository.save(product);
            return {
                message: `this product status is deleted `,
            };
        } catch (err) {
            throw err;
        }
    }

    // async checkProductCanOrder(id: string): Promise<boolean> {
    //     try {
    //         const product = await this.productRepository.getByCondition({
    //             where: {
    //                 id: id,
    //                 categoryId: {
    //                     status: CategoryStatus.active,
    //                 },
    //             },
    //         });
    //         if (!product) {
    //             throw new HttpException(ERROR.PRODUCT_NOT_FOUND.message, ERROR.PRODUCT_NOT_FOUND.statusCode);
    //         }
    //         return product.status === ProductStatus.active;
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}
