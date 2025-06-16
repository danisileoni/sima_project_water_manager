import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilterDto } from 'src/common/dtos/filter.dto';
import { CreateProductDispatchDto } from './dto/create_product_dispatch.dto';
import { ProductDispatch } from './entities/product_dispatch.entity';
import { VehicleTransfer } from './entities/vehicle_transfer.entity';
import { TypePackaging } from './entities/type_packaging.entity';
import { isValidDateYYYY } from 'src/common/helpers/is_valid_date_yyyy.helper';
import { isValidDateYY } from 'src/common/helpers/is_valid_date_yy.helper';
import { User } from 'src/users/entities/user.entity';
import { ExcelService } from 'src/excel/excel.service';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { DispatchProductExcel } from 'src/excel/entities/dispatch_product_excel.entity';
import { TemplatesExcel } from 'src/excel/types/templates_excel';
import * as path from 'path';

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
    @InjectRepository(DispatchProductExcel)
    private readonly dispatchProductExcelRepository: Repository<DispatchProductExcel>,
    private readonly excelService: ExcelService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createProductDispatchDto: CreateProductDispatchDto,
    userId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { type_packaging_id, user_dispatch_id } = createProductDispatchDto;
    try {
      const user = await this.usersRepository.findOneBy({
        id: userId,
        is_active: true,
      });

      if (!user) {
        throw new InternalServerErrorException(
          'User not found, contact your administrator',
        );
      }

      const userDispatch = await this.usersRepository.findOneBy({
        id: user_dispatch_id,
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
        user,
        user_dispatch: userDispatch,
        user_dispatch_id: user_dispatch_id,
      });

      await queryRunner.manager.save(newProductDispatch);

      const lastDispatchProductExcel =
        await this.dispatchProductExcelRepository.findOne({
          order: { created_at: 'DESC' },
          where: {},
        });

      const now = new Date();
      let isNotSameMonth = true;

      if (lastDispatchProductExcel) {
        const lastDate = new Date(lastDispatchProductExcel.created_at);
        isNotSameMonth =
          now.getMonth() !== lastDate.getMonth() ||
          now.getFullYear() !== lastDate.getFullYear();
      }

      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const newSheetName = `${day}-${month}-${year}`;

      let fileId = lastDispatchProductExcel?.file_id || '';
      let fileName = lastDispatchProductExcel?.file_name || '';

      // Siempre crear un nuevo archivo Excel o descargar el existente
      if (!lastDispatchProductExcel || isNotSameMonth) {
        // Crear un nuevo archivo Excel desde la plantilla
        fileName = await this.excelService.createNewFileExcel(
          TemplatesExcel.MontatyDispatchProduct,
        );
        console.log('📄 Nuevo archivo creado:', fileName);
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '1EWPLz4rpN8gZ5H46_C41lskZ0wEA6azK',
        );
        console.log('📄 Archivo subido a Google Drive, fileId:', fileId);
      } else {
        // Descargar el archivo existente de Google Drive
        console.log('📄 Descargando archivo existente de Google Drive');
        try {
          await this.googleDriveService.downloadFile(
            lastDispatchProductExcel.file_id,
            path.join(process.cwd(), 'dist', 'excel', 'tempfiles'),
            lastDispatchProductExcel.file_name,
          );
          fileName = lastDispatchProductExcel.file_name;
          console.log('📄 Archivo descargado correctamente:', fileName);
        } catch (downloadError) {
          console.error(
            '❌ Error al descargar archivo de Google Drive:',
            downloadError,
          );
          // Si falla la descarga, crear un nuevo archivo
          console.log('⚠️ Creando nuevo archivo debido a error de descarga');
          fileName = await this.excelService.createNewFileExcel(
            TemplatesExcel.MontatyDispatchProduct,
          );
          console.log('📄 Nuevo archivo creado:', fileName);
        }
      }

      console.log('📄 newSheetName', newSheetName);

      // Asegurarse de que estamos trabajando con el archivo correcto
      await this.excelService.addContentRawDispatchProduct(
        {
          batch_num: createProductDispatchDto.batch_num,
          date: createProductDispatchDto.date,
          observations: createProductDispatchDto.observations,
          quantity: createProductDispatchDto.quantity,
          num_domain: createProductDispatchDto.num_domain,
          vehicle: createProductDispatchDto.vehicle,
          packaging: typePackaging.packaging,
          responsible: createProductDispatchDto.responsible,
        },
        fileName,
      );

      console.log('📄 Added content to file');

      if (lastDispatchProductExcel) {
        await this.dispatchProductExcelRepository.save(
          lastDispatchProductExcel,
        );
      } else {
        const newDispatchProductExcel =
          this.dispatchProductExcelRepository.create({
            file_id: fileId,
            date: now,
            file_name: fileName,
            path: './dispatch_products',
          });
        await this.dispatchProductExcelRepository.save(newDispatchProductExcel);
      }

      console.log('📄 Saving dispatch product to database');

      // Verificar que el archivo existe en Google Drive antes de reemplazarlo
      const fileExistsInDrive =
        await this.googleDriveService.fileExists(fileId);

      if (fileExistsInDrive) {
        // Reemplazar el archivo existente
        await this.googleDriveService.replaceFile(
          fileId,
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
        );
      } else {
        // Si el archivo no existe, subirlo como nuevo
        console.log(
          '⚠️ El archivo no existe en Google Drive, subiendo como nuevo...',
        );
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '1DmbPy4VJM9Bmr4sP38ZGjbU4qxfxau06',
        );
        console.log('📄 Nuevo fileId', fileId);

        // Actualizar el ID del archivo en la base de datos
        if (lastDispatchProductExcel) {
          lastDispatchProductExcel.file_id = fileId;
          await this.dispatchProductExcelRepository.save(
            lastDispatchProductExcel,
          );
        }
      }

      // Limpiar archivos temporales después de subir a Google Drive
      // Mantener solo el archivo más reciente para futuras operaciones
      await this.excelService.clearTempFiles();
      console.log('🧹 Archivos temporales limpiados');

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

  async findAll(filterDto: FilterDto) {
    try {
      const { limit, offset } = filterDto;

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

  async findDispatchForUser(filterDto: FilterDto, id: string) {
    const { limit, offset, search } = filterDto;
    console.log('findDispatchForUser', filterDto, id);

    try {
      let dispatches: any[] = [];
      let count = 0;

      if (search && search.trim() !== '') {
        // Usar QueryBuilder para búsqueda flexible
        const queryBuilder = this.productDispatchRepository
          .createQueryBuilder('dispatch')
          .leftJoinAndSelect('dispatch.vehicle_transfer', 'vehicle_transfer')
          .leftJoinAndSelect('dispatch.type_packaging', 'type_packaging')
          .leftJoinAndSelect('dispatch.user', 'user')
          .where('dispatch.user_dispatch_id = :id', { id })
          .andWhere('dispatch.is_active = :isActive', { isActive: true })
          .andWhere(
            "(LOWER(dispatch.batch_num) LIKE :search OR TO_CHAR(dispatch.created_at, 'YYYY-MM-DD') LIKE :search)",
            { search: `%${search.toLowerCase()}%` },
          )
          .skip(offset)
          .take(limit)
          .select([
            'dispatch.id',
            'dispatch.batch_num',
            'dispatch.date',
            'dispatch.quantity',
            'dispatch.responsible',
            'dispatch.observations',
            'dispatch.is_active',
            'dispatch.user_dispatch_id',
            'dispatch.created_at',
            'dispatch.updated_at',
            'vehicle_transfer.id',
            'vehicle_transfer.vehicle',
            'vehicle_transfer.num_domain',
            'type_packaging.id',
            'type_packaging.packaging',
            'user.id',
            'user.name',
            'user.surname',
          ]);

        [dispatches, count] = await queryBuilder.getManyAndCount();
      } else {
        [dispatches, count] = await this.productDispatchRepository.findAndCount(
          {
            where: {
              user_dispatch_id: id,
              is_active: true,
            },
            skip: offset,
            take: limit,
            relations: {
              vehicle_transfer: true,
              type_packaging: true,
              user: true,
            },
            select: {
              id: true,
              batch_num: true,
              date: true,
              quantity: true,
              responsible: true,
              observations: true,
              is_active: true,
              user_dispatch_id: true,
              vehicle_transfer: {
                id: true,
                vehicle: true,
                num_domain: true,
              },
              type_packaging: {
                id: true,
                packaging: true,
              },
              user: {
                id: true,
                name: true,
                surname: true,
              },
              created_at: true,
              updated_at: true,
            },
          },
        );
      }

      const totalPages: number = Math.ceil(count / limit);
      const currentPage: number = Math.floor(offset / limit + 1);
      const hasNextPage: boolean = currentPage < totalPages;

      return {
        totalPages,
        currentPage,
        hasNextPage,
        dispatches,
      };
    } catch (error) {
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
