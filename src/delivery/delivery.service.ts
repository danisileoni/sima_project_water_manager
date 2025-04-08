import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClientDto: CreateClientDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userFind = await this.usersRepository.findOne({
        where: {
          id: user.id,
        },
      });

      if (!userFind) {
        throw new NotFoundException(`User not found whit id: ${user.id}`);
      }

      const client = this.clientRepository.create({
        batch_of_product: createClientDto.batch_of_product,
        contact: createClientDto.contact,
        dni_cuit: createClientDto.dni_cuit,
        name_or_company: createClientDto.name_or_company,
        observations: createClientDto.observations,
        quantity: createClientDto.quantity,
        user: userFind,
      });

      await this.clientRepository.save(client);

      delete client.user.dni;
      delete client.user.password;
      delete client.user.role;
      delete client.user.hash_refresh_token;

      return client;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      const clients = this.clientRepository.find({
        take: limit,
        skip: offset,
      });

      const countClients = this.clientRepository
        .createQueryBuilder()
        .getCount();

      const totalPages: number = Math.ceil(+countClients / limit);
      const currentPage: number = Math.floor(offset / limit + 1);
      const hasNextPage: boolean = currentPage < totalPages;

      return {
        totalPages,
        currentPage,
        hasNextPage,
        clients,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  findOne(id: number) {
    try {
      const client = this.clientRepository.findOne({
        where: { id },
      });

      if (!client) {
        throw new NotFoundException(`Client not found whit id: ${id}`);
      }

      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }
}
