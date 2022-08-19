import { ConfigModule } from '@nestjs/config';
import { SendMailService } from './sendMail.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [SendMailService],
    controllers: [],
    exports: [SendMailService],
})
export class SendMailModule {}
