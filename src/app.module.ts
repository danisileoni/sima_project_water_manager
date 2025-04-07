import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm';
import { MailsModule } from './mails/mails.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlantModule } from './plant/plant.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    MailsModule,
    AuthModule,
    UsersModule,
    PlantModule,
    DeliveryModule,
    ExcelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
