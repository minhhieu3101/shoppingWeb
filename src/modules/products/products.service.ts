import { Picture } from './../pictures/pictures.entity';
import { PicturesService } from './../pictures/pictures.service';
import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ProductStatus } from './../../commons/enum/products.enum';
import { Role } from './../../commons/enum/roles.enum';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { CategoryService } from './../categorys/categorys.service';
import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
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
    ) {
        this.productRepository = productRepository;
    }

    async createProduct(productInfo: any, files: Express.Multer.File[]): Promise<Product> {
        try {
            const categoryId = productInfo.categoryId;
            const checkCategoryActive = this.categoryService.checkCategoryActive(categoryId);
            if (!checkCategoryActive) {
                throw new UnauthorizedException(ERROR.CATEGORY_IS_INACTIVE);
            }
            const currentProduct = await this.productRepository.getByCondition({
                where: {
                    name: productInfo.name,
                    categoryId: {
                        id: categoryId,
                    },
                },
            });
            if (currentProduct) {
                throw new HttpException('This product name is existed in category', HttpStatus.BAD_REQUEST);
            }
            const category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                throw new HttpException('Not found this category', HttpStatus.BAD_REQUEST);
            }
            productInfo.categoryId = category;
            if (productInfo.quantityInStock === '0') {
                productInfo.status = ProductStatus.outOfStock;
            }
            const product = await this.productRepository.save(productInfo);
            for (let i = 0; i < files.length; i++) {
                await this.pictureService.createPicture(files[i], product);
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
            return await this.productRepository.getByCondition({
                where: {
                    categoryId: {
                        status: CategoryStatus.active,
                    },
                    id: id,
                    status: Not(ProductStatus.unavailable),
                },
            });
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
            await this.productRepository.getByName(productInfo.name);
            productInfo.updatedAt = new Date();
            return await this.productRepository.update(id, productInfo);
        } catch (err) {
            throw new HttpException('This product name is existed', HttpStatus.BAD_REQUEST);
        }
    }

    async changeProductStatus(id: string, status: ProductStatus): Promise<any> {
        try {
            const product = await this.productRepository.getById(id);
            if (product.status === status) {
                throw new HttpException(`This product is ${status} already`, HttpStatus.BAD_REQUEST);
            }
            product.status = status;
            product.updatedAt = new Date();
            await product.save();
            return {
                message: `this product status is changed to ${status} `,
            };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND);
        }
    }

    async checkProductCanOrder(id: string): Promise<boolean> {
        try {
            const product = await this.productRepository.getById(id);
            return product.status === ProductStatus.active;
        } catch (err) {
            throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND);
        }
    }
}
