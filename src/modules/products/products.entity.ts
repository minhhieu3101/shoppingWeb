import { Category } from './../categorys/categorys.entity';
import { EntityBase } from 'src/commons/database/baseEntity';
import { ProductStatus } from 'src/commons/enum/products.enum';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Product extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    @Exclude()
    barcode: string;

    @Column()
    @Exclude()
    importPrice: number;

    @Column()
    exportPrice: number;

    @Column({ default: 0 })
    salePrice: number;

    @Column({ default: 0 })
    weight: number;

    @Column()
    @Exclude()
    quantityInStock: number;

    @Column({ default: '' })
    @Exclude()
    description: string;

    @Exclude()
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.active,
    })
    status: ProductStatus;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'fkCategoryId' })
    categoryId: Category;
}
