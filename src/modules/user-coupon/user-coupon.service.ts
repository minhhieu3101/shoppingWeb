import { UserCoupon } from './user-coupon.entity';
import { CouponsService } from './../coupons/coupons.service';
import { UserCouponRepository } from './user-coupon.repository';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import { CouponRepository } from '../coupons/coupons.repository';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { CouponStatus } from 'src/commons/enum/coupons.status';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Role } from '../../commons/enum/roles.enum';

@Injectable()
export class UserCouponService {
    constructor(
        private readonly userCouponRepo: UserCouponRepository,
        private readonly couponService: CouponsService,
        private readonly userService: UserService,
        private readonly userRepo: UserRepository,
        private readonly couponRepo: CouponRepository,
    ) {}

    async saveCoupon(userId: string, couponId: string) {
        try {
            if (await this.getUserCouponByCouponId(userId, couponId)) {
                throw new HttpException('You have saved this coupon', HttpStatus.BAD_REQUEST);
            }
            const user = await this.userRepo.getById(userId);
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
            const coupon = await this.couponService.getCouponById(couponId, Role.user);
            return await this.userCouponRepo.save({
                userId: user,
                couponId: coupon,
            });
        } catch (err) {
            throw err;
        }
    }

    async getAllUserCoupon(options: IPaginationOptions, userId: string): Promise<Pagination<UserCoupon>> {
        const queryBulder = this.userCouponRepo
            .getRepository()
            .createQueryBuilder('uc')
            .leftJoinAndSelect('uc.userId', 'user')
            .where('user.id = :userId', { userId: userId });
        return await this.userCouponRepo.paginate(options, queryBulder);
    }

    async getUserCouponByCouponId(userId: string, couponId: string): Promise<UserCoupon> {
        const userCouponExist = await this.userCouponRepo.getByCondition({
            where: {
                userId: {
                    id: userId,
                },
                couponId: {
                    id: couponId,
                    status: CouponStatus.active,
                },
            },
        });
        if (!userCouponExist) {
            throw new HttpException('Not found this coupon', HttpStatus.NOT_FOUND);
        }
        return userCouponExist;
    }

    async checkCanUseCoupon(userId: string, couponId: string): Promise<boolean> {
        const userCouponExist = await this.getUserCouponByCouponId(userId, couponId);
        if (!(await this.couponService.checkActiveCoupon(couponId))) {
            throw new HttpException('This coupon is out of date', HttpStatus.BAD_REQUEST);
        }
        return userCouponExist.used ? false : true;
    }
}
