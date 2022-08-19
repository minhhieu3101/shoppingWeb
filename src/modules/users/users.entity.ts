import { EntityBase } from 'src/commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../commons/enum/roles.enum';

@Entity()
export class User extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    fullname: string;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;

    @Column()
    dob: Date;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: '', length: 4 })
    activeCode: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.user,
    })
    role: Role;
}
