import { UserCoupon } from './user-coupon.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from '../../utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class UserCouponRepository extends RepositoryUtils<UserCoupon> {
    constructor(@InjectRepository(UserCoupon) private userCouponRepository: Repository<UserCoupon>) {
        super(userCouponRepository);
    }
}
