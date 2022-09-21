import { AllExceptionsFilter } from './commons/exceptionFilter/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HandleResponseInterceptor } from './commons/interceptor/respones.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new HandleResponseInterceptor());
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Fresher VMO Shopping Web Project')
        .setDescription('The shoppingWeb API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
