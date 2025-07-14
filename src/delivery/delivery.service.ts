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
import { FilterDto } from '../common/dtos/filter.dto';
import { FilterUniqueClientsDto } from './dto/filter-unique-clients.dto';
import { ExcelService } from 'src/excel/excel.service';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { ClientExcel } from 'src/excel/entities/client_excel.entity';
import { TemplatesExcel } from '../excel/types/templates_excel';
import * as path from 'path';
import { ClientProduct } from './entities/client_product.entity';
import { TypePackaging } from 'src/plant/entities/type_packaging.entity';
import { Address } from 'src/address/entities/address.entity';
import { Province } from 'src/address/entities/province.entity';
import { City } from 'src/address/entities/city.entity';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ClientExcel)
    private readonly clientExcelRepository: Repository<ClientExcel>,
    @InjectRepository(ClientProduct)
    private readonly clientProductRepository: Repository<ClientProduct>,
    @InjectRepository(TypePackaging)
    private readonly typePackagingRepository: Repository<TypePackaging>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly addressService: AddressService,
    private readonly excelService: ExcelService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClientDto: CreateClientDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the complete user information
      const userFind = await this.usersRepository.findOne({
        where: { id: user.id },
      });

      if (!userFind) {
        throw new NotFoundException(`User not found with id: ${user.id}`);
      }

      // Create the client
      const client = this.clientRepository.create({
        contact: createClientDto.contact,
        dni_cuit: createClientDto.dni_cuit,
        name_or_company: createClientDto.name_or_company,
        observations: createClientDto.observations,
        // Use the sum of all products' quantities if available, otherwise use 0
        quantity: createClientDto.products
          ? createClientDto.products.reduce(
              (sum, product) => sum + product.quantity,
              0,
            )
          : 0,
        user: userFind,
      });

      // Create and associate address
      // If address is not provided in the request, create a default address with the client's name as the street
      if (!createClientDto.address) {
        createClientDto.address = {
          street: `Dirección de ${createClientDto.name_or_company}`,
          provinceId: null,
          cityId: null,
        };
      }

      // Use the address service to create the address with proper province and city relationships
      const address = await this.addressService.create(createClientDto.address);
      client.address = address;

      // Save the client
      await this.clientRepository.save(client);

      // Create client_products for each product in the array
      const clientProducts = [];
      if (createClientDto.products && createClientDto.products.length > 0) {
        for (const product of createClientDto.products) {
          // Find the type_packaging by name
          const typePackaging = await this.typePackagingRepository.findOne({
            where: { id: product.product_id },
          });

          if (!typePackaging) {
            throw new NotFoundException(
              `TypePackaging not found with id: ${product.product_id}`,
            );
          }

          // Create and save the client_product
          const clientProduct = this.clientProductRepository.create({
            quantity: product.quantity,
            batch_of_product: product.batch_of_product,
            client: client,
            type_packaging: typePackaging,
          });

          await this.clientProductRepository.save(clientProduct);
          clientProducts.push(clientProduct);
        }
      }

      // Handle Excel file operations
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const newSheetName = `${day}-${month}-${year}`;

      // Buscar archivo mensual en base de datos
      const lastClientExcel = await this.clientExcelRepository.findOne({
        order: { created_at: 'DESC' },
        where: {},
      });

      let fileId = lastClientExcel?.file_id || '';
      let fileName = lastClientExcel?.file_name || '';
      let isNotSameMonth = true;

      if (lastClientExcel) {
        const lastDate = new Date(lastClientExcel.created_at);
        isNotSameMonth =
          now.getMonth() !== lastDate.getMonth() ||
          now.getFullYear() !== lastDate.getFullYear();
      }

      // Si no hay registro en base de datos o es un mes nuevo, buscar en Google Drive antes de crear uno nuevo
      if (!lastClientExcel || isNotSameMonth) {
        // Generar el nombre esperado del archivo mensual
        fileName = `${year}-${String(month).padStart(2, '0')}_montaty_clients.xlsx`;

        // Buscar si ya existe un archivo con ese nombre en la carpeta de Google Drive
        const existingFile = await this.googleDriveService.findFileByName(
          fileName,
          '1DmbPy4VJM9Bmr4sP38ZGjbU4qxfxau06',
        );
        console.log(
          '[DEBUG] Buscando archivo en Google Drive con nombre:',
          fileName,
          'Resultado:',
          existingFile
            ? `ENCONTRADO (ID: ${existingFile.id})`
            : 'NO ENCONTRADO',
        );

        if (existingFile) {
          // Si existe, descargarlo y usarlo
          fileId = existingFile.id;
          try {
            console.log(
              '[DEBUG] Intentando descargar archivo de Google Drive:',
              fileId,
              fileName,
            );
            await this.googleDriveService.downloadFile(
              fileId,
              path.join(process.cwd(), 'dist', 'excel', 'tempfiles'),
              fileName,
            );
            console.log(
              '📄 Archivo mensual encontrado y descargado:',
              fileName,
            );
          } catch (downloadError) {
            console.error(
              '[DEBUG] ❌ Error al descargar archivo mensual de Google Drive:',
              downloadError,
            );
            throw new InternalServerErrorException(
              'No se pudo descargar el archivo mensual de Google Drive. No se agregaron datos para evitar pérdida de historial.',
            );
          }
        } else {
          // Si no existe, crear uno nuevo
          console.log(
            '[DEBUG] No se encontró archivo mensual, creando uno nuevo:',
            fileName,
          );
          fileName = await this.excelService.createNewFileExcel(
            TemplatesExcel.MontatyClients,
          );
          console.log('📄 Nuevo archivo mensual creado:', fileName);
          fileId = '';
        }
      } else {
        // Download the existing file from Google Drive
        console.log('📄 Descargando archivo existente de Google Drive');
        try {
          await this.googleDriveService.downloadFile(
            lastClientExcel.file_id,
            path.join(process.cwd(), 'dist', 'excel', 'tempfiles'),
            lastClientExcel.file_name,
          );
          fileName = lastClientExcel.file_name;
          console.log('📄 Archivo descargado correctamente:', fileName);
        } catch (downloadError) {
          console.error(
            '❌ Error al descargar archivo de Google Drive:',
            downloadError,
          );
          // Si falla la descarga, lanzar error y detener el proceso para evitar pérdida de historial
          throw new InternalServerErrorException(
            'No se pudo descargar el archivo mensual de Google Drive. No se agregaron datos para evitar pérdida de historial.',
          );
        }
      }

      console.log('📄 newSheetName', newSheetName);

      // If there are client_products, add an Excel entry for each one
      if (clientProducts.length > 0) {
        for (const clientProduct of clientProducts) {
          await this.excelService.addContentRawClient(
            {
              batch_of_product: clientProduct.batch_of_product,
              date: newSheetName,
              contact: client.contact,
              dni_cuit: client.dni_cuit,
              name_or_company_name: client.name_or_company,
              observations: client.observations,
              quantity: clientProduct.quantity,
            },
            fileName,
          );
          console.log(
            `📄 Added content to file for client_product ${clientProduct.id}`,
          );
        }
      } else {
        // If no client_products, we don't add any Excel entry since we don't have batch_of_product
        console.log('⚠️ No client_products found, skipping Excel entry');
      }

      // Save or update ClientExcel record
      if (lastClientExcel) {
        await this.clientExcelRepository.save(lastClientExcel);
      } else {
        const newClientExcel = this.clientExcelRepository.create({
          file_id: fileId,
          date: now,
          file_name: fileName,
          path: './clients',
        });
        await this.clientExcelRepository.save(newClientExcel);
      }

      console.log('📄 Saving client to database');

      // Check if the file exists in Google Drive before replacing it
      const fileExistsInDrive =
        await this.googleDriveService.fileExists(fileId);

      if (fileExistsInDrive) {
        // Replace the existing file
        await this.googleDriveService.replaceFile(
          fileId,
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
        );
      } else {
        // If the file doesn't exist, upload it as new
        console.log(
          '⚠️ El archivo no existe en Google Drive, subiendo como nuevo...',
        );
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '1DmbPy4VJM9Bmr4sP38ZGjbU4qxfxau06',
        );
        console.log('📄 Nuevo fileId', fileId);

        // Update the file ID in the database
        if (lastClientExcel) {
          lastClientExcel.file_id = fileId;
          await this.clientExcelRepository.save(lastClientExcel);
        }
      }

      // Clean up temporary files after uploading to Google Drive
      await this.excelService.clearTempFiles();
      console.log('🧹 Archivos temporales limpiados');

      await queryRunner.commitTransaction();

      // Return the client with its relationships
      const clientWithProducts = await this.clientRepository.findOne({
        where: { id: client.id },
        relations: [
          'client_products',
          'client_products.type_packaging',
          'user',
          'address',
          'address.province',
          'address.city',
        ],
      });

      if (clientWithProducts && clientWithProducts.user) {
        delete clientWithProducts.user.dni;
        delete clientWithProducts.user.password;
        delete clientWithProducts.user.role;
        delete clientWithProducts.user.hash_refresh_token;
      }

      return clientWithProducts;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('Check log server');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filterDto: FilterDto) {
    try {
      const { limit, offset, search } = filterDto;

      let clients;
      let countClients;

      if (search) {
        // Use QueryBuilder to search in client fields and related client_products.batch_of_product
        const queryBuilder = this.clientRepository
          .createQueryBuilder('client')
          .leftJoinAndSelect('client.client_products', 'client_products')
          .leftJoinAndSelect('client_products.type_packaging', 'type_packaging')
          .leftJoinAndSelect('client.address', 'address')
          .leftJoinAndSelect('address.province', 'province')
          .leftJoinAndSelect('address.city', 'city')
          .where('client.name_or_company ILIKE :search', {
            search: `%${search}%`,
          })
          .orWhere('client.dni_cuit ILIKE :search', { search: `%${search}%` })
          .orWhere('client_products.batch_of_product ILIKE :search', {
            search: `%${search}%`,
          })
          .orderBy('client.id', 'DESC') // Ordenar por ID en orden descendente
          .take(limit)
          .skip(offset);

        // Get clients with the search condition
        clients = await queryBuilder.getMany();

        // Count total clients matching the search
        countClients = await this.clientRepository
          .createQueryBuilder('client')
          .leftJoin('client.client_products', 'client_products')
          .where('client.name_or_company ILIKE :search', {
            search: `%${search}%`,
          })
          .orWhere('client.dni_cuit ILIKE :search', { search: `%${search}%` })
          .orWhere('client_products.batch_of_product ILIKE :search', {
            search: `%${search}%`,
          })
          .getCount();
      } else {
        clients = await this.clientRepository.find({
          take: limit,
          skip: offset,
          relations: [
            'client_products',
            'client_products.type_packaging',
            'address',
            'address.province',
            'address.city',
          ],
          order: { id: 'DESC' }, // Ordenar por ID en orden descendente
        });

        countClients = await this.clientRepository
          .createQueryBuilder()
          .getCount();
      }

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

  async findAllByClientId(filterDto: FilterDto, user: User) {
    try {
      const { limit, offset, search } = filterDto;

      let clients;
      let countClients;

      if (search) {
        // Use QueryBuilder to search in client fields and related client_products.batch_of_product
        const queryBuilder = this.clientRepository
          .createQueryBuilder('client')
          .leftJoinAndSelect('client.client_products', 'client_products')
          .leftJoinAndSelect('client_products.type_packaging', 'type_packaging')
          .leftJoinAndSelect('client.address', 'address')
          .leftJoinAndSelect('address.province', 'province')
          .leftJoinAndSelect('address.city', 'city')
          .leftJoin('client.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .andWhere(
            '(client.name_or_company ILIKE :search OR client.dni_cuit ILIKE :search OR client_products.batch_of_product ILIKE :search)',
            { search: `%${search}%` },
          )
          .orderBy('client.id', 'DESC') // Ordenar por ID en orden descendente
          .take(limit)
          .skip(offset);

        // Get clients with the search condition
        clients = await queryBuilder.getMany();

        // Count total clients matching the search
        countClients = await this.clientRepository
          .createQueryBuilder('client')
          .leftJoin('client.client_products', 'client_products')
          .leftJoin('client.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .andWhere(
            '(client.name_or_company ILIKE :search OR client.dni_cuit ILIKE :search OR client_products.batch_of_product ILIKE :search)',
            { search: `%${search}%` },
          )
          .getCount();
      } else {
        clients = await this.clientRepository.find({
          take: limit,
          skip: offset,
          relations: [
            'client_products',
            'client_products.type_packaging',
            'address',
            'address.province',
            'address.city',
          ],
          where: { user: { id: user.id } },
          order: { id: 'DESC' }, // Ordenar por ID en orden descendente
        });

        countClients = await this.clientRepository
          .createQueryBuilder('client')
          .leftJoin('client.user', 'user')
          .where('user.id = :userId', { userId: user.id })
          .getCount();
      }

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

  async findOne(id: number) {
    try {
      // Validar que el ID sea un número válido
      if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new NotFoundException(`Invalid ID provided: ${id}`);
      }

      const client = await this.clientRepository.findOne({
        where: { id },
        relations: [
          'client_products',
          'client_products.type_packaging',
          'address',
          'address.province',
          'address.city',
        ],
      });

      if (!client) {
        throw new NotFoundException(`Client not found with id: ${id}`);
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

  async remove(id: number): Promise<void> {
    try {
      const client = await this.findOne(id);
      await this.clientRepository.softRemove(client);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Check log server');
    }
  }

  // Método para listar archivos en Google Drive
  async listDriveFiles() {
    try {
      console.log('📋 Listando archivos en Google Drive');
      const files = await this.googleDriveService.listFiles(20);
      return {
        success: true,
        count: files.length,
        files,
      };
    } catch (error) {
      console.error('❌ Error al listar archivos en Google Drive:', error);
      throw new InternalServerErrorException(
        'Error al listar archivos en Google Drive',
      );
    }
  }

  // Método para verificar si un archivo existe en Google Drive
  async checkDriveFile(fileId: string) {
    try {
      console.log(`🔍 Verificando archivo en Google Drive (ID: ${fileId})`);
      const exists = await this.googleDriveService.fileExists(fileId);
      return {
        success: true,
        exists,
        fileId,
      };
    } catch (error) {
      console.error('❌ Error al verificar archivo en Google Drive:', error);
      throw new InternalServerErrorException(
        'Error al verificar archivo en Google Drive',
      );
    }
  }

  // Método para obtener clientes únicos (sin duplicados) con filtro por nombre y/o DNI
  async findUniqueClients(filterDto: FilterUniqueClientsDto, user: User) {
    try {
      const userId = user.id;
      const { limit, offset, search } = filterDto;

      // Construir la consulta usando QueryBuilder
      const queryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.address', 'address')
        .leftJoinAndSelect('address.province', 'province')
        .leftJoinAndSelect('address.city', 'city');

      // FILTRO OBLIGATORIO por usuario
      queryBuilder.where('client.userId = :userId', { userId }); // Filtro por user_id

      // Aplicar filtro de búsqueda general
      if (search) {
        queryBuilder.andWhere(
          '(client.name_or_company ILIKE :search OR client.dni_cuit ILIKE :search OR client.contact ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // Usar la sintaxis correcta de DISTINCT ON para PostgreSQL
      // Nota: distinctOn debe recibir cada columna como un argumento separado
      queryBuilder
        .distinctOn([
          'client.name_or_company',
          'client.dni_cuit',
          'client.contact',
        ])
        .orderBy('client.name_or_company', 'ASC')
        .addOrderBy('client.dni_cuit', 'ASC')
        .addOrderBy('client.contact', 'ASC')
        .addOrderBy('client.id', 'DESC')
        .take(limit)
        .skip(offset);

      // Obtener los clientes únicos
      const clients = await queryBuilder.getMany();

      // Contar el total de clientes únicos (sin paginación)
      const countQueryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .select(
          'COUNT(DISTINCT(client.name_or_company, client.dni_cuit, client.contact))',
          'count',
        )
        .where('client.userId = :userId', { userId }); // Filtro obligatorio en count

      if (search) {
        countQueryBuilder.andWhere(
          '(client.name_or_company ILIKE :search OR client.dni_cuit ILIKE :search OR client.contact ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      const countResult = await countQueryBuilder.getRawOne();
      const countClients = parseInt(countResult.count);

      const totalPages = Math.ceil(countClients / limit);
      const currentPage = Math.floor(offset / limit + 1);
      const hasNextPage = currentPage < totalPages;

      return {
        totalPages,
        currentPage,
        hasNextPage,
        clients,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Check log server');
    }
  }
}
