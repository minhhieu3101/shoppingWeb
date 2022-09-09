import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { Category } from './categorys.entity';
import { CategoryRepository } from './categorys.repository';
import { Injectable, HttpException } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Role } from '../../commons/enum/roles.enum';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private cloudinaryService: CloudinaryService,
    ) {}

    async getAllCategory(options: IPaginationOptions, role: Role): Promise<Pagination<Category>> {
        try {
            if (role === Role.admin) {
                return await this.categoryRepository.paginate(options);
            }
            const queryBuilder = this.categoryRepository
                .getRepository()
                .createQueryBuilder('c')
                .where('c.status = :active', {
                    active: CategoryStatus.active,
                });
            return await this.categoryRepository.paginate(options, queryBuilder);
        } catch (err) {
            throw err;
        }
    }

    async getCategory(condition: any): Promise<Category> {
        try {
            return await this.categoryRepository.getByCondition({ where: condition });
        } catch (err) {
            throw new HttpException(ERROR.CATEGORY_NOT_FOUND.message, ERROR.CATEGORY_NOT_FOUND.statusCode);
        }
    }

    async getCategoryById(id: string): Promise<Category> {
        return await this.categoryRepository.getByCondition({
            where: {
                id: id,
                status: CategoryStatus.active,
            },
        });
    }

    async createCategory(info: any, upload: Express.Multer.File): Promise<Category> {
        const categoryName = info.name;
        try {
            const category = await this.categoryRepository.getByCondition({
                where: {
                    name: categoryName,
                    status: CategoryStatus.active,
                },
            });
            if (category) {
                throw new HttpException(ERROR.CATEGORY_IS_EXIST.message, ERROR.CATEGORY_IS_EXIST.statusCode);
            }
            if (upload) {
                const file = await this.cloudinaryService.uploadImageToCloudinary(upload);
                info.banner = file.url;
            }
            return await this.categoryRepository.save(info);
        } catch (err) {
            throw err;
        }
    }

    async updateCategory(id: string, info: any): Promise<Category> {
        try {
            const category = await this.categoryRepository.getByCondition({
                where: {
                    id: id,
                    status: CategoryStatus.active,
                },
            });
            if (!category) {
                throw new HttpException(ERROR.CATEGORY_NOT_FOUND.message, ERROR.CATEGORY_NOT_FOUND.statusCode);
            }
            if (info.name && (await this.categoryRepository.getByName(info.name))) {
                throw new HttpException(ERROR.CATEGORY_IS_EXIST.message, ERROR.CATEGORY_IS_EXIST.statusCode);
            }
            info.updatedAt = new Date();
            return await this.categoryRepository.update(id, info);
        } catch (err) {
            throw err;
        }
    }

    async deleteCategory(id: string): Promise<any> {
        try {
            const category = await this.categoryRepository.getByCondition({
                where: {
                    id: id,
                    status: CategoryStatus.active,
                },
            });
            if (!category) {
                throw new HttpException(ERROR.CATEGORY_NOT_FOUND.message, ERROR.CATEGORY_NOT_FOUND.statusCode);
            }
            category.status = CategoryStatus.inactive;
            category.updatedAt = new Date();
            await this.categoryRepository.save(category);
            return {
                message: `This category status is deleted`,
            };
        } catch (err) {
            throw err;
        }
    }

    async checkCategoryActive(id: string): Promise<boolean> {
        try {
            const category = await this.categoryRepository.getById(id);
            return category.status === CategoryStatus.active;
        } catch (err) {
            throw err;
        }
    }
}
