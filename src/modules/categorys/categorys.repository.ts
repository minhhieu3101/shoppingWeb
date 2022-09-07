import { Category } from './categorys.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends RepositoryUtils<Category> {
    constructor(@InjectRepository(Category) private CategoryRepository: Repository<Category>) {
        super(CategoryRepository);
    }
}
