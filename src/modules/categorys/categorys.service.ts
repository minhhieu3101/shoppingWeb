import { CategoryStatus } from './../../commons/enum/categorys.enum';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { Category } from './categorys.entity';
import { CategoryRepository } from './categorys.repository';
import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getAllCategory(condition: any): Promise<Category[]> {
        try {
            return await this.categoryRepository.getAllByCondition({ where: condition });
        } catch (err) {
            throw new NotFoundException(ERROR.CATEGORY_NOT_FOUND);
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

    async createCategory(info: any): Promise<Category> {
        const categoryName = info.name;
        try {
            await this.categoryRepository.getByName(categoryName);
            return await this.categoryRepository.save(info);
        } catch (err) {
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
