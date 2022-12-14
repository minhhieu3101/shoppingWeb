import { Product } from './products.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends RepositoryUtils<Product> {
    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {
        super(productRepository);
    }
}
