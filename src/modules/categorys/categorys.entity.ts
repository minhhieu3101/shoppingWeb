import { Exclude } from 'class-transformer';
import { EntityBase } from '../../commons/database/baseEntity';
import { CategoryStatus } from '../../commons/enum/categorys.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    banner: string;

    @Exclude()
    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.active,
    })
    status: CategoryStatus;
}
