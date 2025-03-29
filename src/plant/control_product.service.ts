import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ControlProduct } from './entities/control_product.entity';
import { ControlProductDto } from './dto/control_product.dto';
import { DrumsQuantity } from './entities/drums_quantity.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isValidDateYYYY } from 'src/common/helpers/is_valid_date_yyyy.helper';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ControlProductService {
  constructor(
    @InjectRepository(ControlProduct)
    private readonly controlProductRepository: Repository<ControlProduct>,
    @InjectRepository(DrumsQuantity)
    private readonly drumsQuantityRepository: Repository<DrumsQuantity>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(controlProductDto: ControlProductDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userResponsible = await this.usersRepository.findOneBy({
        id: user.id,
        is_active: true,
      });

      const { quantity_enter, quantity_out, date, ...restControlProduct } =
        controlProductDto;

      const dateValid = isValidDateYYYY(date);

      if (!isValidDateYYYY(date).valid) {
        throw new NotFoundException('Date not valid');
      }

      const controlProduct = this.controlProductRepository.create({
        ...restControlProduct,
        user: userResponsible,
        date: dateValid.date,
        drums_quantity: this.drumsQuantityRepository.create({
          quantity_enter,
          quantity_out,
        }),
      });
      await queryRunner.manager.save(controlProduct);

      await queryRunner.commitTransaction();

      delete controlProduct.user.dni;
      delete controlProduct.user.password;
      delete controlProduct.user.role;
      delete controlProduct.user.hash_refresh_token;

      return controlProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;

      const controlProduct = await this.controlProductRepository.find({
        take: limit,
        skip: offset,
        relations: ['drums_quantity'],
      });

      const countControlProduct = await this.controlProductRepository
        .createQueryBuilder()
        .getCount();

      const totalPages: number = Math.ceil(+countControlProduct / limit);
      const currentPage: number = Math.floor(offset / limit + 1);
      const hasNextPage: boolean = currentPage < totalPages;

      if (controlProduct.length <= 0) {
        throw new NotFoundException('Control product not found');
      }

      return {
        totalPages,
        currentPage,
        hasNextPage,
        controlProduct,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async findOne(id: number) {
    try {
      const controlProduct = await this.controlProductRepository.findOne({
        where: { id },
        relations: ['drums_quantity'],
      });

      if (!controlProduct) {
        throw new NotFoundException('Control product not found');
      }

      return controlProduct;
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
      if (await !this.findOne(id)) {
        throw new NotFoundException('Control product not found');
      }

      const controlProduct = await this.controlProductRepository.preload({
        id: id,
        is_active: false,
      });

      await this.controlProductRepository.save(controlProduct);

      return { message: 'Control product deleted successfully', deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }
}
