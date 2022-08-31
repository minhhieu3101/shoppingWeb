import { PictureRepository } from './pictures.repository';
import { Picture } from './pictures.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    imports: [TypeOrmModule.forFeature([Picture]), CloudinaryModule],
    providers: [PicturesService, PictureRepository],
    exports: [PicturesService],
})
export class PicturesModule {}
