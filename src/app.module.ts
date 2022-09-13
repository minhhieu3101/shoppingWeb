import { UserCouponModule } from './modules/user-coupon/user-coupon.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auths/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConnect } from './configs/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/categorys/categorys.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'src/configs/.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: databaseConnect,
        }),
        UsersModule,
        AuthModule,
        CategoryModule,
        ProductsModule,
        OrdersModule,
        CouponsModule,
        UserCouponModule,
        MulterModule.register({
            storage: memoryStorage(),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
