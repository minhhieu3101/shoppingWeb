import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from 'src/utils/database.utils';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';

@Injectable()
export class OrderRepository extends RepositoryUtils<Order> {
    constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {
        super(orderRepository);
    }
}
