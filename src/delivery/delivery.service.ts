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
import { ExcelService } from 'src/excel/excel.service';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { ClientExcel } from 'src/excel/entities/client_excel.entity';
import { TemplatesExcel } from '../excel/types/templates_excel';
import * as path from 'path';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ClientExcel)
    private readonly clientExcelRepository: Repository<ClientExcel>,
    private readonly excelService: ExcelService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClientDto: CreateClientDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userFind = await this.usersRepository.findOne({
        where: { id: user.id },
      });

      if (!userFind) {
        throw new NotFoundException(`User not found with id: ${user.id}`);
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

      const lastClientExcel = await this.clientExcelRepository.findOne({
        order: { created_at: 'DESC' },
        where: {},
      });

      const now = new Date();
      let isNotSameMonth = true;

      if (lastClientExcel) {
        const lastDate = new Date(lastClientExcel.created_at);
        isNotSameMonth =
          now.getMonth() !== lastDate.getMonth() ||
          now.getFullYear() !== lastDate.getFullYear();
      }

      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const newSheetName = `${day}-${month}-${year}`;

      let fileId = lastClientExcel?.file_id || '';
      let fileName = lastClientExcel?.file_name || '';

      // Siempre crear un nuevo archivo Excel o descargar el existente
      if (!lastClientExcel || isNotSameMonth) {
        // Crear un nuevo archivo Excel desde la plantilla
        fileName = await this.excelService.createNewFileExcel(
          TemplatesExcel.MontatyClients,
        );
        console.log('📄 Nuevo archivo creado:', fileName);
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '1DmbPy4VJM9Bmr4sP38ZGjbU4qxfxau06'
        );
        console.log('📄 Archivo subido a Google Drive, fileId:', fileId);
      } else {
        // Descargar el archivo existente de Google Drive
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
          console.error('❌ Error al descargar archivo de Google Drive:', downloadError);
          // Si falla la descarga, crear un nuevo archivo
          console.log('⚠️ Creando nuevo archivo debido a error de descarga');
          fileName = await this.excelService.createNewFileExcel(
            TemplatesExcel.MontatyClients,
          );
          console.log('📄 Nuevo archivo creado:', fileName);
        }
      }

      console.log('📄 newSheetName', newSheetName);

      // Asegurarse de que estamos trabajando con el archivo correcto
      await this.excelService.addContentRawClient(
        {
          batch_of_product: createClientDto.batch_of_product,
          date: newSheetName,
          contact: createClientDto.contact,
          dni_cuit: createClientDto.dni_cuit,
          name_or_company_name: createClientDto.name_or_company,
          observations: createClientDto.observations,
          quantity: createClientDto.quantity,
        },
        fileName,
      );

      console.log('📄 Added content to file');

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
      
      // Verificar que el archivo existe en Google Drive antes de reemplazarlo
      const fileExistsInDrive = await this.googleDriveService.fileExists(fileId);
      
      if (fileExistsInDrive) {
        // Reemplazar el archivo existente
        await this.googleDriveService.replaceFile(
          fileId,
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
        );
      } else {
        // Si el archivo no existe, subirlo como nuevo
        console.log('⚠️ El archivo no existe en Google Drive, subiendo como nuevo...');
        fileId = await this.googleDriveService.uploadFile(
          path.join(process.cwd(), 'dist', 'excel', 'tempfiles', fileName),
          'application/octet-stream',
          '1DmbPy4VJM9Bmr4sP38ZGjbU4qxfxau06'
        );
        console.log('📄 Nuevo fileId', fileId);
        
        // Actualizar el ID del archivo en la base de datos
        if (lastClientExcel) {
          lastClientExcel.file_id = fileId;
          await this.clientExcelRepository.save(lastClientExcel);
        }
      }
      
      // Limpiar archivos temporales después de subir a Google Drive
      // Mantener solo el archivo más reciente para futuras operaciones
      await this.excelService.clearTempFiles();
      console.log('🧹 Archivos temporales limpiados');

      await queryRunner.commitTransaction();

      delete client.user.dni;
      delete client.user.password;
      delete client.user.role;
      delete client.user.hash_refresh_token;

      return client;
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

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit, offset } = paginationDto;
      const clients = await this.clientRepository.find({
        take: limit,
        skip: offset,
      });

      const countClients = await this.clientRepository
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
      throw new InternalServerErrorException('Error al listar archivos en Google Drive');
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
      throw new InternalServerErrorException('Error al verificar archivo en Google Drive');
    }
  }
}
