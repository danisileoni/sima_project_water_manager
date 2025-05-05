import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { ClientExcel } from 'src/excel/entities/client_excel.entity';
import { ExcelModule } from 'src/excel/excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User, ClientExcel]), ExcelModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, GoogleDriveService],
})
export class DeliveryModule {}
