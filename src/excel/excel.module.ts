import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientExcel } from './entities/client_excel.entity';
import { ControlProductExcel } from './entities/control_product_excel.entity';
import { DispatchProductExcel } from './entities/dispatch_product_excel.entity';
import { GoogleDriveService } from 'src/common/google-drive.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientExcel,
      ControlProductExcel,
      DispatchProductExcel,
    ]),
  ],
  controllers: [ExcelController],
  providers: [ExcelService, GoogleDriveService],
})
export class ExcelModule {}
