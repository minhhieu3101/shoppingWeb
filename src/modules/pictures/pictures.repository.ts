import { Picture } from './pictures.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryUtils } from 'src/utils/database.utils';
import { Repository } from 'typeorm';

@Injectable()
export class PictureRepository extends RepositoryUtils<Picture> {
    constructor(@InjectRepository(Picture) private PictureRepository: Repository<Picture>) {
        super(PictureRepository);
    }
}
