import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({ folder: 'shopping - web' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            Readable.from(file.buffer).pipe(upload);
        });
    }

    async uploadImageToCloudinary(file: Express.Multer.File) {
        return await this.uploadImage(file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }
}
