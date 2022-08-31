import { ProductStatus } from 'src/commons/enum/products.enum';
import { OrderProduct } from './order-product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from 'src/utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductRepository extends RepositoryUtils<OrderProduct> {
    constructor(@InjectRepository(OrderProduct) private orderProductRepository: Repository<OrderProduct>) {
        super(orderProductRepository);
    }

    getOrderProduct(orderId: string) {
        return this.orderProductRepository
            .createQueryBuilder('orderProduct')
            .leftJoinAndSelect('orderProduct.productId', 'product')
            .where('orderProduct.orderId = :id AND orderProduct.status = :status', {
                id: orderId,
                status: ProductStatus.active,
            })
            .getMany();
    }

    getAllOrderProduct() {
        return this.orderProductRepository
            .createQueryBuilder('orderProduct')
            .leftJoinAndSelect('orderProduct.productId', 'product')
            .leftJoinAndSelect('orderProduct.orderId', 'order')
            .getMany();
    }
}
