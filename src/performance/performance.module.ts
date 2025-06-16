import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/delivery/entities/client.entity';
import { ProductDispatch } from 'src/plant/entities/product_dispatch.entity';
import { ControlProduct } from 'src/plant/entities/control_product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ProductDispatch, ControlProduct]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
