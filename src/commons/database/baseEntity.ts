import { Exclude } from 'class-transformer';
import { BaseEntity, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class EntityBase extends BaseEntity {
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'NOW()',
    })
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'NOW()',
    })
    @Exclude()
    updatedAt: Date;
}
