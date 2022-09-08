import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class SendMailService {
    private nodemailerTransport: Mail;

    constructor(private readonly configService: ConfigService) {
        this.nodemailerTransport = createTransport({
            service: this.configService.get('EMAIL_SERVICE'),
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
            from: this.configService.get('EMAIL_USER'),
        });
    }

    async sendMail(email: string) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            await this.nodemailerTransport.sendMail({
                from: '"MinhHieu " <mhieu3101@gmail.com>',
                to: email,
                subject: 'Verify Your Account',
                html: `<p>Enter <b>${otp}</b> to verify your email address</p>`,
            });
            return otp;
        } catch (err) {
            throw err;
        }
    }
}
