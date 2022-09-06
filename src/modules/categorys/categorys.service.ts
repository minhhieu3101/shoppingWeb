import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { Category } from './categorys.entity';
import { CategoryRepository } from './categorys.repository';
import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Role } from 'src/commons/enum/roles.enum';

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
            throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND);
        }
    }

    async getCategoryById(id: string): Promise<Category> {
        try {
            return await this.categoryRepository.getById(id);
        } catch (err) {
            throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND);
        }
    }

    async createCategory(info: any, upload: Express.Multer.File): Promise<Category> {
        const categoryName = info.name;
        try {
            await this.categoryRepository.getByName(categoryName);
            const file = await this.cloudinaryService.uploadImageToCloudinary(upload);
            info.banner = file.url;
            return await this.categoryRepository.save(info);
        } catch (err) {
            console.log(err);

            throw new UnauthorizedException(ERROR.CATEGORY_IS_EXIST);
        }
    }

    async updateCategory(id: string, info: any): Promise<Category> {
        try {
            const category = await this.categoryRepository.getById(id);
            if (category.status === CategoryStatus.inactive) {
                throw new UnauthorizedException(ERROR.CATEGORY_IS_INACTIVE);
            }
            if (info.name && (await this.categoryRepository.getByName(info.name))) {
                throw new UnauthorizedException(ERROR.CATEGORY_IS_EXIST);
            }
            info.updatedAt = new Date();
            return await this.categoryRepository.update(id, info);
        } catch (err) {
            throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND);
        }
    }

    async changeCategoryStatus(id: string, status: CategoryStatus): Promise<any> {
        try {
            const category = await this.categoryRepository.getById(id);
            if (category.status === status) {
                throw new HttpException(`This category is ${status} already`, HttpStatus.BAD_REQUEST);
            }
            category.status = status;
            category.updatedAt = new Date();
            await this.categoryRepository.save(category);
            return {
                message: `This category status is changed to ${status} now`,
            };
        } catch (err) {
            throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND);
        }
    }

    async checkCategoryActive(id: string): Promise<boolean> {
        try {
            const category = await this.getCategoryById(id);
            return category.status === CategoryStatus.active;
        } catch (err) {
            throw err;
        }
    }
}
