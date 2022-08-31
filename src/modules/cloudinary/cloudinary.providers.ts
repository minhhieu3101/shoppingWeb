import { ConfigOptions, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
export const CloudinaryProvider = {
    provide: 'Cloudinary',
    useFactory: (): ConfigOptions => {
        console.log(new ConfigService().get<string>('CLOUD_NAME'));

        return v2.config({
            cloud_name: new ConfigService().get<string>('CLOUD_NAME'),
            api_key: new ConfigService().get<string>('CLOUD_APIKEY'),
            api_secret: new ConfigService().get<string>('CLOUD_APISECRET'),
        });
    },
};
