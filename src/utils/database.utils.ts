// nơi code các câu lệnh chung với DB ( CRUD )
import { BaseEntity, DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';

export class RepositoryUtils<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(private _repository: Repository<T>) {
        this.repository = _repository;
    }
    create(item: DeepPartial<T>): Promise<T> {
        return this.repository.save(item);
    }

    getAll(): Promise<T[]> {
        return this.repository.find({});
    }

    getById(id: string): Promise<T> {
        return this.repository.createQueryBuilder().where({ id: id }).getOne();
    }

    getByCondition(condition: any): Promise<T> {
        return this.repository.findOne(condition);
    }

    update(id: string, info: any): Promise<any> {
        return this.repository.update(id, info);
    }

    async deleteOneById(id: string): Promise<T> {
        const entity = await this.getById(id);
        return this.repository.remove(entity);
    }
}
