import { UserStatus } from './../../commons/enum/users.enum';
import { Exclude } from 'class-transformer';
import { EntityBase } from '../../commons/database/baseEntity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../commons/enum/roles.enum';

@Entity()
export class User extends EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
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

    @Exclude()
    @Column({ default: '', length: 4 })
    activeCode: string;

    @Exclude()
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.user,
    })
    role: Role;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.inactive,
    })
    @Exclude()
    status: UserStatus;
}
