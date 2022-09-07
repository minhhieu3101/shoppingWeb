import { OrderStatus } from './../../commons/enum/orders.enum';
import { UserService } from './../users/users.service';
import { ERROR } from '../../commons/errorHandling/errorHandling';
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

    async createOrder(info: any, userId: string) {
        try {
            const user = await this.userService.getYourInfo(userId);
            if (!user) {
                throw new NotFoundException(ERROR.USER_NOT_FOUND);
            }
            const order = await this.orderRepository.save({
                address: info.address,
                description: info.description ? info.description : null,
                totalPrice: 0,
                userId: user,
            });

            const productArray = info.productArray;
            let totalPrice = 0;
            for (let i = 0; i < productArray.length; i++) {
                if (!productArray[i].productId || !productArray[i].quantity) {
                    await this.orderRepository.deleteOneById(order.id);
                    throw new HttpException('Your product array has some wrong object', HttpStatus.BAD_REQUEST);
                }
                if (
                    !(await this.orderProductService.checkEnoughQuantityInProductToSold(
                        productArray[i].productId,
                        productArray[i].quantity,
                    ))
                ) {
                    await this.orderRepository.deleteOneById(order.id);
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
            console.log(err);

            throw err;
        }
    }

    async getYourOrder(userId: string): Promise<object> {
        try {
            const order = await this.orderRepository.getAllByCondition({
                where: { userId: { id: userId }, status: OrderStatus.active },
            });
            if (!order) {
                throw new HttpException('This user do not have any order', HttpStatus.BAD_REQUEST);
            }
            const totalResult = [];
            for (let i = 0; i < order.length; i++) {
                const orderProductArr = await this.orderProductService.getOrderProduct(order[i].id, OrderStatus.active);
                const result = { ...order[i], orderProduct: orderProductArr };
                totalResult.push({ Order: result });
            }
            if (totalResult.length === 0) {
                throw new HttpException('This user do not have any order', HttpStatus.ACCEPTED);
            }
            return totalResult;
        } catch (err) {
            console.log(err);

            throw err;
        }
    }

    async getAllOrder(): Promise<any[]> {
        try {
            const orderArr = await this.orderRepository.getAllByCondition({
                relations: { userId: true },
            });
            if (!orderArr) {
                throw new HttpException('Not have any order from user', HttpStatus.BAD_REQUEST);
            }
            const totalResult = [];
            for (let i = 0; i < orderArr.length; i++) {
                const orderProductArr = await this.orderProductService.getOrderProduct(orderArr[i].id);
                const result = { ...orderArr[i], orderProduct: orderProductArr };
                totalResult.push({ Order: result });
            }
            if (totalResult.length === 0) {
                throw new HttpException('All user do not have any order', HttpStatus.ACCEPTED);
            }
            return totalResult;
        } catch (err) {
            throw err;
        }
    }

    async deleteOrderProduct(id: string): Promise<object> {
        try {
            const orderProduct = await this.orderProductService.deteteOrderProduct(id);
            const order = orderProduct.orderId;

            const countOrderProduct = await this.orderProductService.countOrderProduct(order.id);
            console.log(countOrderProduct);

            if (countOrderProduct === 0) {
                order.status = OrderStatus.inactive;
            }
            order.totalPrice -= orderProduct.price;
            await order.save();
            return {
                message: `Delete this order product ${orderProduct.id} is success`,
            };
        } catch (err) {
            console.log(err);

            throw err;
        }
    }

    async deleteOrder(id: string): Promise<object> {
        try {
            const order = await this.orderRepository.getById(id);
            if (order.status === OrderStatus.inactive) {
                throw new HttpException('This order has been deleted yet', HttpStatus.BAD_REQUEST);
            }

            const orderProductArr = await this.orderProductService.getOrderProduct(id, OrderStatus.active);

            for (let i = 0; i < orderProductArr.length; i++) {
                orderProductArr[i].status = OrderStatus.inactive;
                await orderProductArr[i].save();
            }
            order.status = OrderStatus.inactive;
            await order.save();
            return {
                message: `Delete this order ${order.id} is success`,
            };
        } catch (err) {
            console.log(err);

            throw err;
        }
    }
}
