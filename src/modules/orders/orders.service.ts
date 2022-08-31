import { OrderProduct } from './../order-product/order-product.entity';
import { OrderStatus } from './../../commons/enum/orders.enum';
import { UserService } from './../users/users.service';
import { ERROR } from 'src/commons/errorHandling/errorHandling';
import { OrderProductService } from './../order-product/order-product.service';
import { OrderRepository } from './orders.repository';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class OrdersService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
        private readonly orderProductService: OrderProductService,
    ) {}

    async createOrder(info: any) {
        try {
            const userId = info.userId;
            const user = await this.userService.getYourInfo(userId);
            if (!user) {
                throw new NotFoundException(ERROR.USER_NOT_FOUND);
            }
            const order = await this.orderRepository.save({
                address: info.address,
                description: info.description ? info.description : null,
                totalPrice: 0,
                userId: user,
                updatedAt: new Date(),
            });
            const productArray = info.productArray;
            let totalPrice = 0;
            for (let i = 0; i < productArray.length; i++) {
                if (!productArray[i].productId || !productArray[i].quantity) {
                    throw new HttpException('Your product array has some wrong object', HttpStatus.BAD_REQUEST);
                }
                if (
                    !this.orderProductService.checkEnoughQuantityInProductToSold(
                        productArray[i].productId,
                        productArray[i].quantity,
                    )
                ) {
                    throw new HttpException(
                        `This product ${productArray[i].productId} do not have enough quantity for your order`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }
            for (let i = 0; i < productArray.length; i++) {
                const orderProduct = await this.orderProductService.createOrderProduct({
                    order: order,
                    productId: productArray[i].productId,
                    quantity: productArray[i].quantity,
                });
                if (orderProduct) {
                    totalPrice += orderProduct.price;
                }
            }
            order.totalPrice += totalPrice;
            return await this.orderRepository.save(order);
        } catch (err) {
            throw err;
        }
    }

    async getYourOrder(userId: string): Promise<OrderProduct[]> {
        try {
            const order = await this.orderRepository.getByCondition({
                where: { userId: { id: userId }, status: OrderStatus.active },
            });
            if (!order) {
                throw new HttpException('This user do not have any order', HttpStatus.BAD_REQUEST);
            }
            const orderProductArr = await this.orderProductService.getOrderProduct(order.id);
            return orderProductArr;
        } catch (err) {
            console.log(err);

            throw err;
        }
    }

    async getAllOrder(): Promise<OrderProduct[]> {
        try {
            return await this.orderProductService.getAllOrderProduct();
        } catch (err) {
            throw err;
        }
    }
}
