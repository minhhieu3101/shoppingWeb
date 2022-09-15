import { UserCouponModule } from './../user-coupon/user-coupon.module';
import { OrderProductModule } from './../order-product/order-product.module';
import { UsersModule } from './../users/users.module';
import { cacheModule } from './../cache/cache.module';
import { OrderRepository } from './orders.repository';
import { Order } from './orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { jwtModule } from '../jwts/jwts.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        jwtModule,
        cacheModule,
        UsersModule,
        OrderProductModule,
        UserCouponModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrderRepository],
    exports: [OrdersService],
})
export class OrdersModule {}
