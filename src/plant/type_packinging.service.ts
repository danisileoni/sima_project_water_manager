import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterDto } from 'src/common/dtos/filter.dto';
import { TypePackaging } from './entities/type_packaging.entity';
import { CreateTypePackagingDto } from './dto/create_type_packaging';

@Injectable()
export class TypePackagingService {
  constructor(
    @InjectRepository(TypePackaging)
    private readonly typePackagingRepository: Repository<TypePackaging>,
  ) {}

  async create(createTypePackagingDto: CreateTypePackagingDto) {
    try {
      const newTypePackaging = this.typePackagingRepository.create({
        packaging: createTypePackagingDto.packaging,
        milliliters: createTypePackagingDto.milliliters,
        liters: createTypePackagingDto.liters,
      });

      await this.typePackagingRepository.save(newTypePackaging);

      return newTypePackaging;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async findAll(filterDto: FilterDto) {
    try {
      const { limit, offset } = filterDto;

      const typePackaging = await this.typePackagingRepository.find({
        take: limit,
        skip: offset,
      });

      const countTypePackaging = await this.typePackagingRepository
        .createQueryBuilder()
        .getCount();

      const totalPages: number = Math.ceil(+countTypePackaging / limit);
      const currentPage: number = Math.floor(offset / limit + 1);
      const hasNextPage: boolean = currentPage < totalPages;

      if (typePackaging.length <= 0) {
        throw new NotFoundException('type packaging not found');
      }

      return {
        totalPages,
        currentPage,
        hasNextPage,
        typePackaging,
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
      const typePackaging = await this.typePackagingRepository.findOneBy({
        id,
      });

      if (!typePackaging) {
        throw new NotFoundException('Type Packaging not found');
      }

      return typePackaging;
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
        throw new NotFoundException('Plant not found');
      }

      const typePackaging = await this.typePackagingRepository.preload({
        id: id,
        is_active: false,
      });

      await this.typePackagingRepository.save(typePackaging);

      return { message: 'Type Packaging deleted successfully', deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }
}
