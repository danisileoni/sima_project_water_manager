import { promises as fs } from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientExcel } from './entities/client_excel.entity';
import { Repository } from 'typeorm';
import { ControlProductExcel } from './entities/control_product_excel.entity';
import { DispatchProductExcel } from './entities/dispatch_product_excel.entity';
import { GoogleDriveService } from 'src/common/google-drive.service';
import { TemplatesExcel } from './types/templates_excel';
import { ClientExcelDto } from './dto/clients-excel.dto';
import { ControlProductExcelDto } from './dto/control-product-excel.dto';
import { DispatchProductExcelDto } from './dto/dispatch-product-excel.dto';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(ClientExcel)
    private readonly clientExcelRepository: Repository<ClientExcel>,
    @InjectRepository(ControlProductExcel)
    private readonly controlProductExcelRepository: Repository<ControlProductExcel>,
    @InjectRepository(DispatchProductExcel)
    private readonly dispatchProductExcelRepository: Repository<DispatchProductExcel>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createNewFileExcel(template: TemplatesExcel) {
    const filename = template.replace('_template.xlsx', '');
    const dateHour = new Date().toISOString().replace(/:/g, '-').split('.')[0];

    const original = path.join(__dirname, `./templates/${template}`);
    const destiny = path.join(
      __dirname,
      `./tempfiles/${dateHour}_${filename}.xlsx`,
    );

    try {
      await fs.copyFile(original, destiny);
    } catch (error) {
      throw new Error(error);
    }
  }

  async addContentRawClient(clientExcelDto: ClientExcelDto) {}
  async addContentRawControlProduct(
    controlProductExcelDto: ControlProductExcelDto,
  ) {}
  async addContentRawDispatchProduct(
    dispatchProductExcelDto: DispatchProductExcelDto,
  ) {}
}
