import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { ProductRepository } from './../products/products.repository';
import { Order } from './../orders/orders.entity';
import { OrderProduct } from './order-product.entity';
import { OrderProductRepository } from './order-product.repository';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ProductStatus } from 'src/commons/enum/products.enum';

@Injectable()
export class OrderProductService {
    constructor(private orderProductRepo: OrderProductRepository, private productRepo: ProductRepository) {}

    async createOrderProduct(info: any): Promise<OrderProduct> {
        try {
            const order = info.order as Order;
            const product = await this.productRepo.getById(info.productId);
            if (!product) {
                throw new NotFoundException(ERROR.PRODUCT_NOT_FOUND);
            }
            info.price = product.exportPrice * info.quantity;
            const orderProduct = await this.orderProductRepo.save({
                price: info.price,
                quantity: info.quantity,
                orderId: order,
                productId: product,
            });
            if (!orderProduct) {
                throw new HttpException(
                    `Can not create order product with productiD ${info.productId} and order ${order.id}`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            product.quantityInStock -= orderProduct.quantity;
            await product.save();
            return orderProduct;
        } catch (err) {
            throw err;
        }
    }

    async checkEnoughQuantityInProductToSold(productId: string, quantity: number): Promise<boolean> {
        const product = await this.productRepo.getByCondition({
            where: { id: productId, status: ProductStatus.active },
        });
        return quantity < product.quantityInStock ? true : false;
    }

    getOrderProduct(orderId: string): Promise<OrderProduct[]> {
        return this.orderProductRepo.getOrderProduct(orderId);
    }

    getAllOrderProduct(): Promise<OrderProduct[]> {
        return this.orderProductRepo.getAllOrderProduct();
    }
}
