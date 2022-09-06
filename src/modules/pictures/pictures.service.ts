import { Product } from './../products/products.entity';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { PictureRepository } from './pictures.repository';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Picture } from './pictures.entity';

@Injectable()
export class PicturesService {
    constructor(private pictureRepo: PictureRepository, private cloudinaryService: CloudinaryService) {}

    async createPicture(file: Express.Multer.File, product: Product) {
        const upload = await this.cloudinaryService.uploadImageToCloudinary(file);
        const url = upload.url as string;
        return this.pictureRepo.save({ url: url, productId: product });
    }

    getPicture(options: IPaginationOptions, productId: string): Promise<Pagination<Picture>> {
        const queryBuilder = this.pictureRepo
            .getRepository()
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.productId', 'product')
            .where('product.id = :id', {
                id: productId,
            });
        return this.pictureRepo.paginate(options, queryBuilder);
    }
}
