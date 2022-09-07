import { OrderStatus } from './../../commons/enum/orders.enum';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { ProductRepository } from './../products/products.repository';
import { Order } from './../orders/orders.entity';
import { OrderProduct } from './order-product.entity';
import { OrderProductRepository } from './order-product.repository';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '../../commons/enum/products.enum';

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
        if (!product) {
            return false;
        }
        return quantity < product.quantityInStock ? true : false;
    }

    countOrderProduct(orderId) {
        return this.orderProductRepo.count({
            where: {
                orderId: {
                    id: orderId,
                },
                status: OrderStatus.active,
            },
        });
    }

    getOrderProduct(orderId: string, status?: OrderStatus): Promise<OrderProduct[]> {
        return this.orderProductRepo.getAllByCondition({
            where: {
                orderId: {
                    id: orderId,
                    status: status,
                },
                status: status,
            },
            relations: { productId: true },
        });
    }

    getAllOrderProduct(): Promise<OrderProduct[]> {
        return this.orderProductRepo.getAllByCondition({
            relations: { productId: true, orderId: true },
        });
    }

    async deteteOrderProduct(id: string): Promise<OrderProduct> {
        try {
            const orderProduct = await this.orderProductRepo.getByCondition({
                where: {
                    id: id,
                    status: OrderStatus.active,
                },
                relations: { orderId: true },
            });
            orderProduct.status = OrderStatus.inactive;
            await orderProduct.save();
            return orderProduct;
        } catch (err) {
            throw err;
        }
    }
}
