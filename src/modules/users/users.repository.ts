import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from 'src/utils/database.utils';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UserRepository extends RepositoryUtils<User> {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository);
    }

    checkUserExist(username: string, email: string): Promise<User> {
        return this.userRepository.findOne({ where: [{ username: username }, { email: email }] });
    }
}
