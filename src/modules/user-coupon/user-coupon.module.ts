import { UserCouponRepository } from './user-coupon.repository';
import { UserCoupon } from './user-coupon.entity';
import { Module } from '@nestjs/common';
import { UserCouponController } from './user-coupon.controller';
import { UserCouponService } from './user-coupon.service';
import { jwtModule } from '../jwts/jwts.module';
import { cacheModule } from '../cache/cache.module';
import { CouponsModule } from '../coupons/coupons.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UserCoupon]), CouponsModule, UsersModule, jwtModule, cacheModule],
    controllers: [UserCouponController],
    providers: [UserCouponService, UserCouponRepository],
    exports: [UserCouponService],
})
export class UserCouponModule {}
