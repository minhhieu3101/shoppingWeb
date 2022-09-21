import { CouponRepository } from './coupons.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CouponStatus } from '../../commons/enum/coupons.status';
import { Coupon } from './coupons.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Role } from '../../commons/enum/roles.enum';

@Injectable()
export class CouponsService {
    constructor(private readonly couponRepository: CouponRepository) {}

    async createCoupon(couponInfo: any): Promise<Coupon> {
        if (couponInfo.begin > couponInfo.end) {
            throw new HttpException('Coupon begin time is higher than end time', HttpStatus.BAD_REQUEST);
        }
        const begin = new Date(couponInfo.begin);
        couponInfo.begin = new Date(begin.setHours(begin.getHours() - 7));
        const end = new Date(couponInfo.end);
        couponInfo.end = new Date(end.setHours(end.getHours() - 7));
        if (couponInfo.end < new Date()) {
            throw new HttpException('Coupon end time is lower than date now', HttpStatus.BAD_REQUEST);
        }
        if (
            (couponInfo.quantity as number) <= 0 ||
            (couponInfo.discount as number) <= 0 ||
            (couponInfo.discount as number) > 100
        ) {
            throw new HttpException('Coupon quantity or coupon number is wrong', HttpStatus.BAD_REQUEST);
        }
        const existCoupon = await this.couponRepository.getByCondition({
            where: {
                name: couponInfo.name,
                status: CouponStatus.active,
            },
        });

        if (existCoupon) {
            throw new HttpException('Coupon name is exist', HttpStatus.BAD_REQUEST);
        }
        return await this.couponRepository.save(couponInfo);
    }

    // async deleteCoupon(id: string): Promise<void> {
    //     const coupon = await this.couponRepository.getById(id);
    //     if (!coupon) {
    //         throw new HttpException('Can not find this coupon', HttpStatus.NOT_FOUND);
    //     }
    //     if (coupon.status === CouponStatus.deleted) {
    //         throw new HttpException('Coupon has been deleted already', HttpStatus.BAD_REQUEST);
    //     }
    //     coupon.status = CouponStatus.deleted;
    //     await coupon.save();
    // }

    async getAllCoupon(options: IPaginationOptions, role: Role): Promise<Pagination<Coupon>> {
        if (role === Role.admin) {
            return await this.couponRepository.paginate(options);
        }
        const queryBuilder = this.couponRepository
            .getRepository()
            .createQueryBuilder('c')
            .where('c.status = :active AND NOW() BETWEEN c.begin and c.end ', {
                active: CouponStatus.active,
            });
        if (!queryBuilder.getMany() || (await queryBuilder.getCount()) === 0) {
            throw new HttpException('Not have any Coupon', HttpStatus.BAD_REQUEST);
        }
        return await this.couponRepository.paginate(options, queryBuilder);
    }

    async getCouponById(id: string, role: Role): Promise<Coupon> {
        if (role === Role.admin) {
            return await this.couponRepository.getById(id);
        }
        const coupon = await this.couponRepository.getByCondition({
            where: {
                id: id,
                status: CouponStatus.active,
            },
        });
        if (!coupon) {
            throw new HttpException('Can not find this coupon', HttpStatus.NOT_FOUND);
        }
        if (new Date(coupon.end) < new Date() || new Date(coupon.begin) > new Date()) {
            throw new HttpException('Coupon is out of date', HttpStatus.BAD_REQUEST);
        }
        return coupon;
    }
}
