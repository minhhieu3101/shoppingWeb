import { Category } from './categorys.entity';
import { CategoryRepository } from './categorys.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getAllCategory(): Promise<Category[]> {
        return await this.categoryRepository.getAll();
    }

    async getCategory(category: string): Promise<Category> {
        return await this.categoryRepository.getByCondition({ where: { name: category } });
    }

    async createCategory(info: any): Promise<Category> {
        return await this.categoryRepository.save(info);
    }

    async updateCategory(id: string, info: any): Promise<Category> {
        return await this.categoryRepository.update(id, info);
    }

    async deleteCategory(id: string): Promise<Category> {
        return await this.categoryRepository.deleteOneById(id);
    }
}
