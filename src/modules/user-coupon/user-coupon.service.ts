import { UserCoupon } from './user-coupon.entity';
import { CouponsService } from './../coupons/coupons.service';
import { UserCouponRepository } from './user-coupon.repository';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { UserRepository } from '../users/users.repository';
import { CouponRepository } from '../coupons/coupons.repository';
import { ERROR } from '../../commons/errorHandling/errorHandling';
import { CouponStatus } from '../../commons/enum/coupons.status';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Role } from '../../commons/enum/roles.enum';
import { UserStatus } from '../../commons/enum/users.enum';
import { Coupon } from '../coupons/coupons.entity';

@Injectable()
export class UserCouponService {
    constructor(
        private readonly userCouponRepo: UserCouponRepository,
        private readonly couponService: CouponsService,
        private readonly userService: UserService,
        private readonly userRepo: UserRepository,
        private readonly couponRepo: CouponRepository,
    ) {}

    async saveCoupon(userId: string, couponId: string): Promise<UserCoupon> {
        try {
            const coupon = await this.couponService.getCouponById(couponId, Role.user);
            const userCouponExist = await this.userCouponRepo.getByCondition({
                where: {
                    userId: {
                        id: userId,
                        status: UserStatus.active,
                    },
                    couponId: {
                        id: couponId,
                        status: CouponStatus.active,
                    },
                },
            });
            if (userCouponExist) {
                throw new HttpException('You have saved this coupon', HttpStatus.BAD_REQUEST);
            }

            const user = await this.userRepo.getById(userId);
            if (!user) {
                throw new HttpException(ERROR.USER_NOT_FOUND.message, ERROR.USER_NOT_FOUND.statusCode);
            }
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
            .leftJoinAndSelect('uc.couponId', 'c')
            .where('user.id = :userId AND c.status = :active AND NOW() BETWEEN c.begin and c.end ', {
                userId: userId,
                active: CouponStatus.active,
            });
        if (!queryBulder.getMany() || (await queryBulder.getCount()) === 0) {
            throw new HttpException('This user do not have any coupon', HttpStatus.BAD_REQUEST);
        }
        return await this.userCouponRepo.paginate(options, queryBulder);
    }

    async getUserCouponByCouponId(userId: string, couponId: string): Promise<UserCoupon> {
        const userCoupon = await this.userCouponRepo.getByCondition({
            where: {
                userId: {
                    id: userId,
                    status: UserStatus.active,
                },
                couponId: {
                    id: couponId,
                    status: CouponStatus.active,
                },
            },
        });
        if (!userCoupon) {
            throw new HttpException('Not found this coupon', HttpStatus.NOT_FOUND);
        }
        return userCoupon;
    }

    async getCouponByCouponId(couponId: string): Promise<Coupon> {
        return await this.couponService.getCouponById(couponId, Role.user);
    }

    // async hasUsedCoupon(userId: string, couponId: string): Promise<void> {
    //     const userCoupon = await this.getUserCouponByCouponId(userId, couponId);
    //     userCoupon.used = true;
    //     const coupon = userCoupon.couponId;
    //     coupon.quantity -= 1;
    //     await coupon.save();
    //     await userCoupon.save();
    // }
}
