import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDispatchDto } from './dto/create_product_dispatch.dto';
import { ProductDispatch } from './entities/product_dispatch.entity';
import { VehicleTransfer } from './entities/vehicle_transfer.entity';
import { TypePackaging } from './entities/type_packaging.entity';
import { isValidDateYYYY } from 'src/common/helpers/is_valid_date_yyyy.helper';
import { isValidDateYY } from 'src/common/helpers/is_valid_date_yy.helper';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductDispatchService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ProductDispatch)
    private readonly productDispatchRepository: Repository<ProductDispatch>,
    @InjectRepository(VehicleTransfer)
    private readonly vehicleTransferRepository: Repository<VehicleTransfer>,
    @InjectRepository(TypePackaging)
    private readonly typePackagingRepository: Repository<TypePackaging>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDispatchDto: CreateProductDispatchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { type_packaging_id } = createProductDispatchDto;
    try {
      const user = await this.usersRepository.findOneBy({
        is_active: true,
      });

      if (!user) {
        throw new InternalServerErrorException(
          'User not found, contact your administrator',
        );
      }

      const validDate = isValidDateYYYY(createProductDispatchDto.date);

      if (!validDate.valid) {
        throw new BadRequestException('Date not valid');
      }

      if (!isValidDateYY(createProductDispatchDto.batch_num).valid) {
        throw new BadRequestException(
          'Batch num not valid, format valid: "dd/MM/yy"',
        );
      }

      const typePackaging = await this.typePackagingRepository.findOneBy({
        id: type_packaging_id,
        is_active: true,
      });

      if (!typePackaging) {
        throw new NotFoundException(
          `Type Packaging not found with id: ${createProductDispatchDto.type_packaging_id}`,
        );
      }

      const newVehicleTransfer = this.vehicleTransferRepository.create({
        vehicle: createProductDispatchDto.vehicle,
        num_domain: createProductDispatchDto.num_domain,
      });
      await queryRunner.manager.save(newVehicleTransfer);

      const newProductDispatch = this.productDispatchRepository.create({
        batch_num: createProductDispatchDto.batch_num,
        quantity: createProductDispatchDto.quantity,
        responsible: createProductDispatchDto.responsible,
        observations: createProductDispatchDto.observations,
        date: validDate.date,
        vehicle_transfer: newVehicleTransfer,
        type_packaging: typePackaging,
      });

      await queryRunner.manager.save(newProductDispatch);
      await queryRunner.commitTransaction();

      return newProductDispatch;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;

      const productsDispatch = await this.productDispatchRepository.find({
        take: limit,
        skip: offset,
        relations: ['vehicle_transfer', 'type_packaging'],
      });

      const countProductDispatch = await this.productDispatchRepository
        .createQueryBuilder()
        .getCount();

      const totalPages: number = Math.ceil(+countProductDispatch / limit);
      const currentPage: number = Math.floor(offset / limit + 1);
      const hasNextPage: boolean = currentPage < totalPages;

      if (productsDispatch.length <= 0) {
        throw new NotFoundException('Plant clendar not found');
      }

      return {
        totalPages,
        currentPage,
        hasNextPage,
        productsDispatch,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async findOne(id: number) {
    try {
      const productDispatch = await this.productDispatchRepository.find({
        where: { id },
        relations: ['vehicle_transfer', 'type_packaging'],
      });

      if (!productDispatch) {
        throw new NotFoundException('Product dispatch not found');
      }

      return productDispatch;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async remove(id: number) {
    try {
      // First check if the product dispatch exists
      const productDispatch = await this.findOne(id);

      if (!productDispatch) {
        throw new NotFoundException('Product dispatch not found');
      }

      // Update the is_active field directly
      await this.productDispatchRepository
        .createQueryBuilder()
        .update(ProductDispatch)
        .set({ is_active: false })
        .where('id = :id', { id })
        .execute();

      return {
        message: 'Product dispatch deleted successfully',
        deleted: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }
}
