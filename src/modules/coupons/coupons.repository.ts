import { Coupon } from './coupons.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class CouponRepository extends RepositoryUtils<Coupon> {
    constructor(@InjectRepository(Coupon) private couponRepository: Repository<Coupon>) {
        super(couponRepository);
    }
}
