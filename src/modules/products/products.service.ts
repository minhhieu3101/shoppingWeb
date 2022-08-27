import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ProductStatus } from './../../commons/enum/products.enum';
import { Role } from './../../commons/enum/roles.enum';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { CategoryService } from './../categorys/categorys.service';
import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Product } from './products.entity';
import { ProductRepository } from './products.repository';
import { Not } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryService: CategoryService,
    ) {}

    async createProduct(categoryId: string, productInfo: any): Promise<Product> {
        try {
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
            return await this.productRepository.save(productInfo);
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

    async getAllProductByCategory(categoryId: string, role: Role): Promise<Product[]> {
        try {
            if (role === Role.admin) {
                return await this.productRepository.getAllByCondition({ where: { categoryId: categoryId } });
            }
            return await this.productRepository.getAllByCondition({
                where: {
                    categoryId: {
                        id: categoryId,
                        status: CategoryStatus.active,
                    },
                    status: Not(ProductStatus.unavailable),
                },
            });
        } catch (err) {
            throw err;
        }
    }

    async getAllProduct(role: Role): Promise<Product[]> {
        try {
            if (role === Role.admin) {
                return await this.productRepository.getAll();
            }
            return await this.productRepository.getAllByCondition({
                where: {
                    categoryId: {
                        status: CategoryStatus.active,
                    },
                    status: Not(ProductStatus.unavailable),
                },
            });
        } catch (err) {
            throw err;
        }
    }

    async updateProduct(id: string, productInfo: any): Promise<Product> {
        try {
            await this.productRepository.getByName(productInfo.name);
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
