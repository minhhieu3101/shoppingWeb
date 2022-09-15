import { Coupon } from './../coupons/coupons.entity';
import { UserCoupon } from './../user-coupon/user-coupon.entity';
import { UserCouponService } from './../user-coupon/user-coupon.service';
import { OrderStatus } from './../../commons/enum/orders.enum';
import { UserService } from './../users/users.service';
import { OrderProductService } from './../order-product/order-product.service';
import { OrderRepository } from './orders.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CouponStatus } from '../../commons/enum/coupons.status';

@Injectable()
export class OrdersService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
        private readonly orderProductService: OrderProductService,
        private readonly userCouponService: UserCouponService,
    ) {}

    async createOrder(info: any, userId: string) {
        let orderId;
        try {
            const couponId = info.couponId;
            const user = await this.userService.getYourInfo(userId);
            const order = await this.orderRepository.save({
                address: info.address,
                description: info.description ? info.description : null,
                totalPayment: 0,
                userId: user,
            });
            orderId = order.id;

            const productArray = info.productArray;
            let totalPayment = 0;
            for (let i = 0; i < productArray.length; i++) {
                if (!productArray[i].productId || !productArray[i].quantity) {
                    throw new HttpException('Your product array has some wrong object', HttpStatus.BAD_REQUEST);
                }
                const checkProduct = await this.orderProductService.checkProductCanOrder(
                    productArray[i].productId,
                    productArray[i].quantity,
                );
                if (checkProduct === false) {
                    throw new HttpException(
                        `This product ${productArray[i].productId} do not have enough quantity for your order`,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                if (checkProduct === null) {
                    throw new HttpException(
                        `This product ${productArray[i].productId} not found`,
                        HttpStatus.NOT_FOUND,
                    );
                }
            }
            let userCoupon;
            let coupon;
            if (couponId) {
                coupon = await this.userCouponService.getCouponByCouponId(couponId);
                userCoupon = await this.userCouponService.getUserCouponByCouponId(userId, couponId);
                if (userCoupon.used) {
                    throw new HttpException('This coupon has been used', HttpStatus.BAD_REQUEST);
                }
                userCoupon.used = true;
                coupon.quantity -= 1;
                if (coupon.quantity === 0) {
                    coupon.status = CouponStatus.outOfStock;
                }
            }
            for (let i = 0; i < productArray.length; i++) {
                const orderProduct = await this.orderProductService.createOrderProduct({
                    order: order,
                    productId: productArray[i].productId,
                    quantity: productArray[i].quantity,
                });
                if (orderProduct) {
                    totalPayment += orderProduct.payment;
                }
            }
            if (userCoupon instanceof UserCoupon && coupon instanceof Coupon) {
                totalPayment = (totalPayment * (100 - coupon.discount)) / 100;
                await userCoupon.save();
                await coupon.save();
            }
            order.totalPayment = totalPayment;
            return await this.orderRepository.save(order);
        } catch (err) {
            await this.orderRepository.deleteOneById(orderId);
            console.log(err);

            throw err;
        }
    }

    async getYourOrder(userId: string): Promise<object> {
        try {
            const order = await this.orderRepository.getAllByCondition({
                where: { userId: { id: userId }, status: OrderStatus.active },
            });
            if (!order || order.length === 0) {
                throw new HttpException('This user do not have any order', HttpStatus.BAD_REQUEST);
            }
            const totalResult = [];
            for (let i = 0; i < order.length; i++) {
                const orderProductArr = await this.orderProductService.getOrderProduct(order[i].id, OrderStatus.active);
                const result = { ...order[i], orderProduct: orderProductArr };
                totalResult.push({ Order: result });
            }
            return totalResult;
        } catch (err) {
            throw err;
        }
    }

    async getAllOrder(): Promise<any[]> {
        try {
            const orderArr = await this.orderRepository.getAllByCondition({
                relations: { userId: true },
            });
            if (!orderArr || orderArr.length === 0) {
                throw new HttpException('Not have any order from user', HttpStatus.BAD_REQUEST);
            }
            const totalResult = [];
            for (let i = 0; i < orderArr.length; i++) {
                const orderProductArr = await this.orderProductService.getOrderProduct(orderArr[i].id);
                const result = { ...orderArr[i], orderProduct: orderProductArr };
                totalResult.push({ Order: result });
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

            if (countOrderProduct === 0) {
                order.status = OrderStatus.inactive;
            }
            order.totalPayment -= orderProduct.payment;
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
                await this.orderProductService.deteteOrderProduct(orderProductArr[i].id);
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
