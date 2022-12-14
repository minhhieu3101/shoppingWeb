import { EntityBase } from '../../commons/database/baseEntity';
import { User } from './../users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../../commons/enum/orders.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Order extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 0 })
    totalPayment: number;

    @Column()
    address: string;

    @Column({ nullable: true })
    @Exclude()
    description: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.active,
    })
    @Exclude()
    status: OrderStatus;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    @Exclude()
    userId: User;
}
