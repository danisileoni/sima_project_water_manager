import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import * as path from 'path';
import { Workbook } from 'exceljs';

@Module({
  imports: [],
  providers: [
    {
      provide: 'EXCEL_FILE_PATH',
      useValue: path.join(__dirname, './tempfiles'),
    },
    {
      provide: Workbook,
      useFactory: () => new Workbook(),
    },
    ExcelService,
  ],
})
export class ExcelModule {}
