import { Product } from './../products/products.entity';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { PictureRepository } from './pictures.repository';

@Injectable()
export class PicturesService {
    constructor(private pictureRepo: PictureRepository, private cloudinaryService: CloudinaryService) {}

    async createPicture(file: Express.Multer.File, product: Product) {
        const upload = await this.cloudinaryService.uploadImageToCloudinary(file);
        const url = upload.url as string;
        return this.pictureRepo.save({ url: url, productId: product });
    }

    getPicture(productId: string) {
        return this.pictureRepo.getAllByCondition({
            where: {
                productId: {
                    id: productId,
                },
            },
        });
    }
}
