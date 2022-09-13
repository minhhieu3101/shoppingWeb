import { Coupon } from '../coupons/coupons.entity';
import { EntityBase } from '../../commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class UserCoupon extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: false })
    used: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fkUserId' })
    userId: User;

    @ManyToOne(() => Coupon)
    @JoinColumn({ name: 'fkCouponId' })
    couponId: Coupon;
}
