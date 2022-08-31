import { EntityBase } from 'src/commons/database/baseEntity';
import { Order } from './../orders/orders.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../products/products.entity';
import { Exclude } from 'class-transformer';
import { OrderStatus } from 'src/commons/enum/orders.enum';

@Entity()
export class OrderProduct extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.active,
    })
    @Exclude()
    status: OrderStatus;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'fkOrderId' })
    orderId: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'fkProductId' })
    productId: Product;
}