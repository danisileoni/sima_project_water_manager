import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import * as path from 'path';

@Module({
  imports: [],
  providers: [
    {
      provide: 'EXCEL_FILE_PATH',
      useValue: path.join(process.cwd(), 'dist/excel/tempfiles'),
    },
    ExcelService,
  ],
  exports: [ExcelService],
})
export class ExcelModule {}
