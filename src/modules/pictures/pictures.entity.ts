import { Product } from './../products/products.entity';
import { EntityBase } from '../../commons/database/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Picture extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    productId: Product;
}
