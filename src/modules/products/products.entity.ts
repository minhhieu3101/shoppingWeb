import { Category } from './../categorys/categorys.entity';
import { IsOptional } from 'class-validator';
import { EntityBase } from 'src/commons/database/baseEntity';
import { ProductStatus } from 'src/commons/enum/products.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Product extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    barcode: string;

    @Column()
    importPrice: number;

    @Column()
    exportPrice: number;

    @Column()
    @IsOptional()
    salePrice: string;

    @Column()
    @IsOptional()
    weight: number;

    @Column()
    quantityInStock: number;

    @Column()
    @IsOptional()
    description: string;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.active,
    })
    status: ProductStatus;

    @OneToOne(() => Category, (category) => category.id)
    categoryId: Category;
}
