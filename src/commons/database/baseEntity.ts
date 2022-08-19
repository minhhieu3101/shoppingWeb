import { BaseEntity, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class EntityBase extends BaseEntity {
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'NOW()',
    })
    updatedAt: Date;
}
