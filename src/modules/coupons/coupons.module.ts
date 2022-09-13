import { CouponRepository } from './coupons.repository';
import { Coupon } from './coupons.entity';
import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { jwtModule } from '../jwts/jwts.module';
import { cacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Coupon]), jwtModule, cacheModule],
    controllers: [CouponsController],
    providers: [CouponsService, CouponRepository],
    exports: [CouponsService, CouponRepository],
})
export class CouponsModule {}
