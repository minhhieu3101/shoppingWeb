import { EntityBase } from 'src/commons/database/baseEntity';
import { CategoryStatus } from 'src/commons/enum/categorys.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: '' })
    description: string;

    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.active,
    })
    status: CategoryStatus;
}
