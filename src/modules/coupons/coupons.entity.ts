import { EntityBase } from '../../commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CouponStatus } from '../../commons/enum/coupons.status';

@Entity()
export class Coupon extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    discount: number;

    @Column({
        type: 'timestamp',
        default: 'now()',
    })
    begin: string;

    @Column({
        type: 'timestamp',
        default: 'now()',
    })
    end: string;

    @Exclude()
    @Column({
        type: 'enum',
        enum: CouponStatus,
        default: CouponStatus.active,
    })
    status: CouponStatus;
}
