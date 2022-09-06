// nơi code các câu lệnh chung với DB ( CRUD )
import { BaseEntity, DeepPartial, SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

export class RepositoryUtils<T extends BaseEntity> {
    protected readonly repository: Repository<T>;
    constructor(protected _repository: Repository<T>) {
        this.repository = _repository;
    }

    getRepository(): Repository<T> {
        return this.repository;
    }

    // create data T to repo or update data
    save(item: DeepPartial<T>): Promise<T> {
        return this.repository.save(item);
    }

    paginate(options: IPaginationOptions, queryBuilder?: SelectQueryBuilder<T>): Promise<Pagination<T>> {
        const query = queryBuilder ? queryBuilder : this.repository.createQueryBuilder();
        return paginate<T>(query, options);
    }

    async create(item: DeepPartial<T>): Promise<T> {
        return this.repository.create(item);
    }

    async count(condition: any): Promise<number> {
        return await this.repository.count(condition);
    }

    getByName(name: string): Promise<T> {
        return this.repository.createQueryBuilder().where({ name: name }).getOne();
    }

    getAll(): Promise<T[]> {
        return this.repository.find({});
    }

    getAllByCondition(condition: any): Promise<T[]> {
        return this.repository.find(condition);
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
