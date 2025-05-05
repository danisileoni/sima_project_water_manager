import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrumsQuantity } from './entities/drums_quantity.entity';
import { VehicleTransfer } from './entities/vehicle_transfer.entity';
import { TypePackaging } from './entities/type_packaging.entity';
import { ControlProduct } from './entities/control_product.entity';
import { ProductDispatch } from './entities/product_dispatch.entity';
import { ProductDispatchService } from './product_dispatch.service';
import { TypePackagingService } from './type_packinging.service';
import { User } from 'src/users/entities/user.entity';
import { ControlProductService } from './control_product.service';
import { ExcelModule } from 'src/excel/excel.module';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { ControlProductExcel } from 'src/excel/entities/control_product_excel.entity';
import { DispatchProductExcel } from 'src/excel/entities/dispatch_product_excel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DrumsQuantity,
      VehicleTransfer,
      TypePackaging,
      ControlProduct,
      ProductDispatch,
      User,
      ControlProductExcel,
      DispatchProductExcel,
    ]),
    ExcelModule,
  ],
  controllers: [PlantController],
  providers: [
    ProductDispatchService,
    TypePackagingService,
    ControlProductService,
    GoogleDriveService,
  ],
})
export class PlantModule {}
