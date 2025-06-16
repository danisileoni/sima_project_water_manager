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
import { FilterDto } from 'src/common/dtos/filter.dto';
import { isValidDateYYYY } from 'src/common/helpers/is_valid_date_yyyy.helper';
import { User } from 'src/users/entities/user.entity';
import { ExcelService } from 'src/excel/excel.service';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { ControlProductExcel } from 'src/excel/entities/control_product_excel.entity';
import { TemplatesExcel } from 'src/excel/types/templates_excel';
import * as path from 'path';

@Injectable()
export class ControlProductService {
  constructor(
    @InjectRepository(ControlProduct)
    private readonly controlProductRepository: Repository<ControlProduct>,
    @InjectRepository(DrumsQuantity)
    private readonly drumsQuantityRepository: Repository<DrumsQuantity>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ControlProductExcel)
    private readonly controlProductExcelRepository: Repository<ControlProductExcel>,
    private readonly excelService: ExcelService,
    private readonly googleDriveService: GoogleDriveService,
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

      const lastControlProductExcel =
        await this.controlProductExcelRepository.findOne({
          order: { created_at: 'DESC' },
          where: {},
        });

      const now = new Date();
      let isNotSameMonth = true;

      if (lastControlProductExcel) {
        const lastDate = new Date(lastControlProductExcel.created_at);
        isNotSameMonth =
          now.getMonth() !== lastDate.getMonth() ||
          now.getFullYear() !== lastDate.getFullYear();
      }

      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const newSheetName = `${day}-${month}-${year}`;

      let fileId = lastControlProductExcel?.file_id || '';
      let fileName = lastControlProductExcel?.file_name || '';

      // Siempre crear un nuevo archivo Excel o descargar el existente
      if (!lastControlProductExcel || isNotSameMonth) {
        // Crear un nuevo archivo Excel desde la plantilla
        fileName = await this.excelService.createNewFileExcel(
          TemplatesExcel.MontatyControlProduct,
        );
        console.log('📄 Nuevo archivo creado:', fileName);
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '13iIqqjziao1qAX-_Fj8HE5QKoQ7NFwtW',
        );
        console.log('📄 Archivo subido a Google Drive, fileId:', fileId);
      } else {
        // Descargar el archivo existente de Google Drive
        console.log('📄 Descargando archivo existente de Google Drive');
        try {
          await this.googleDriveService.downloadFile(
            lastControlProductExcel.file_id,
            path.join(process.cwd(), 'dist', 'excel', 'tempfiles'),
            lastControlProductExcel.file_name,
          );
          fileName = lastControlProductExcel.file_name;
          console.log('📄 Archivo descargado correctamente:', fileName);
        } catch (downloadError) {
          console.error(
            '❌ Error al descargar archivo de Google Drive:',
            downloadError,
          );
          // Si falla la descarga, crear un nuevo archivo
          console.log('⚠️ Creando nuevo archivo debido a error de descarga');
          fileName = await this.excelService.createNewFileExcel(
            TemplatesExcel.MontatyControlProduct,
          );
          console.log('📄 Nuevo archivo creado:', fileName);
        }
      }

      console.log('📄 newSheetName', newSheetName);

      // Asegurarse de que estamos trabajando con el archivo correcto
      await this.excelService.addContentRawControlProduct(
        {
          batch_num: controlProductDto.batch_num,
          observations: controlProductDto.observations,
          production_date: date,
          quantity_enter: controlProductDto.quantity_enter,
          quantity_out: controlProductDto.quantity_out,
          responsible: controlProductDto.responsible,
        },
        fileName,
      );

      console.log('📄 Added content to file');

      if (lastControlProductExcel) {
        await this.controlProductExcelRepository.save(lastControlProductExcel);
      } else {
        const newControlProductExcel =
          this.controlProductExcelRepository.create({
            file_id: fileId,
            date: now,
            file_name: fileName,
            path: './control_products',
          });
        await this.controlProductExcelRepository.save(newControlProductExcel);
      }

      console.log('📄 Saving control product to database');

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
        if (lastControlProductExcel) {
          lastControlProductExcel.file_id = fileId;
          await this.controlProductExcelRepository.save(
            lastControlProductExcel,
          );
        }
      }

      // Limpiar archivos temporales después de subir a Google Drive
      // Mantener solo el archivo más reciente para futuras operaciones
      await this.excelService.clearTempFiles();
      console.log('🧹 Archivos temporales limpiados');

      await queryRunner.commitTransaction();

      delete controlProduct.user.dni;
      delete controlProduct.user.password;
      delete controlProduct.user.role;
      delete controlProduct.user.hash_refresh_token;

      return controlProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
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
