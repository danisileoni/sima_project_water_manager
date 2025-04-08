import ExcelJs from 'exceljs';
import { Workbook } from 'exceljs';
import fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { TemplatesExcel } from './types/templates_excel';
import { ClientExcelDto } from './dto/clients-excel.dto';
import { ControlProductExcelDto } from './dto/control-product-excel.dto';
import { DispatchProductExcelDto } from './dto/dispatch-product-excel.dto';

@Injectable()
export class ExcelService {
  constructor(
    @Inject('EXCEL_FILE_PATH')
    private readonly pathFolder: string,
    private readonly workbook: Workbook,
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
      await fs.promises.copyFile(original, destiny);
    } catch (error) {
      throw new Error(error);
    }
  }

  async addContentRawClient(clientExcelDto: ClientExcelDto) {
    const {
      batch_of_product,
      contact,
      date,
      dni_cuit,
      name_or_company_name,
      observations,
    } = clientExcelDto;

    try {
      const workbook = this.workbook;
      await workbook.xlsx.readFile(this.pathTempFile());

      let sheet = this.findSheetWithAvailableRow(workbook, 'A');
      if (!sheet) {
        const templatePath = path.join(
          __dirname,
          './templates/sima_clients_template.xlsx',
        );
        const now = new Date();
        const newSheetName = now
          .toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/\//g, '-')
          .replace(/:/g, '-')
          .replace(',', '');

        sheet = await this.copyTemplateSheetFromFile(
          templatePath,
          workbook,
          newSheetName,
        );
      }

      const values: Record<string, string> = {
        A: name_or_company_name,
        D: dni_cuit,
        E: batch_of_product,
        G: date,
        H: contact,
        L: observations,
      };

      for (const column in values) {
        const value = values[column];
        const cellAddress = this.findFirstEmptyCellInColumn(sheet, column);
        if (cellAddress) {
          sheet.getCell(cellAddress).value = value;
        } else {
          console.warn(`No available space in column ${column}`);
        }
      }

      const valueEmission = sheet.getCell('J3').value;
      const regex = /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/;
      const contentDate = regex.test(valueEmission.toString());

      if (!contentDate) {
        const date = new Date();

        const formattedDate = this.formateDate(date);
        sheet.getCell('J3').value = `${valueEmission} ${formattedDate}`;
      }

      await workbook.xlsx.writeFile(this.pathTempFile());
    } catch (error) {
      console.error('Error writing client data to Excel:', error);
      throw error;
    }
  }

  async addContentRawControlProduct(
    controlProductExcelDto: ControlProductExcelDto,
  ) {
    const {
      batch_num,
      observations,
      production_date,
      quantity_enter,
      quantity_out,
      responsible,
    } = controlProductExcelDto;

    try {
      const workbook = this.workbook;
      await workbook.xlsx.readFile(this.pathTempFile());

      let sheet = this.findSheetWithAvailableRow(workbook, 'A');

      if (!sheet) {
        const templatePath = path.join(
          __dirname,
          './templates/sima_control_product_template.xlsx',
        );
        const now = new Date();
        const newSheetName = now
          .toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/\//g, '-')
          .replace(/:/g, '-')
          .replace(',', '');
        sheet = await this.copyTemplateSheetFromFile(
          templatePath,
          workbook,
          newSheetName,
        );
      }

      const values: Record<string, string | number> = {
        A: production_date,
        B: batch_num,
        D: quantity_enter,
        F: quantity_out,
        H: responsible,
        K: observations,
      };

      for (const column in values) {
        const value = values[column];
        const cellAddress = this.findFirstEmptyCellInColumn(sheet, column);
        if (cellAddress) {
          sheet.getCell(cellAddress).value = value;
        } else {
          console.warn(`No available space in column ${column}`);
        }
      }

      const valueEmission = sheet.getCell('J3').value;
      const regex = /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/;
      const contentDate = regex.test(valueEmission.toString());

      if (!contentDate) {
        const date = new Date();
        const formattedDate = this.formateDate(date);
        sheet.getCell('J3').value = `${valueEmission} ${formattedDate}`;
      }

      await workbook.xlsx.writeFile(this.pathTempFile());
    } catch (error) {
      console.error('Error writing control product data to Excel:', error);
      throw error;
    }
  }

  async addContentRawDispatchProduct(
    dispatchProductExcelDto: DispatchProductExcelDto,
  ) {
    const {
      batch_num,
      date,
      observations,
      quantity,
      num_domain,
      vehicle,
      packaging,
      responsible,
    } = dispatchProductExcelDto;

    try {
      const workbook = this.workbook;
      await workbook.xlsx.readFile(this.pathTempFile());

      let sheet = this.findSheetWithAvailableRow(workbook, 'A');

      if (!sheet) {
        const templatePath = path.join(
          __dirname,
          './templates/sima_dispatch_product_template.xlsx',
        );
        const now = new Date();
        const newSheetName = now
          .toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/\//g, '-')
          .replace(/:/g, '-')
          .replace(',', '');
        sheet = await this.copyTemplateSheetFromFile(
          templatePath,
          workbook,
          newSheetName,
        );
      }

      const values: Record<string, string | number> = {
        A: date,
        B: batch_num,
        D: quantity,
        E: packaging,
        G: vehicle,
        I: num_domain,
        K: responsible,
        M: observations,
      };

      for (const column in values) {
        const value = values[column];
        const cellAddress = this.findFirstEmptyCellInColumn(sheet, column);
        if (cellAddress) {
          sheet.getCell(cellAddress).value = value;
        } else {
          console.warn(`No available space in column ${column}`);
        }
      }

      const valueEmission = sheet.getCell('J3').value;
      const regex = /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/;
      const contentDate = regex.test(valueEmission.toString());

      if (!contentDate) {
        const date = new Date();
        const formattedDate = this.formateDate(date);
        sheet.getCell('J3').value = `${valueEmission} ${formattedDate}`;
      }

      await workbook.xlsx.writeFile(this.pathTempFile());
    } catch (error) {
      console.error('Error writing dispatch product data to Excel:', error);
      throw error;
    }
  }

  pathTempFile() {
    const files = fs.readdirSync(this.pathFolder).filter((name) => {
      const pathFile = path.join(this.pathFolder, name);
      return fs.statSync(pathFile).isFile();
    });

    if (files.length === 1) {
      return path.join(this.pathFolder, files[0]);
    }

    throw new Error('No files found');
  }

  isCellInMergedRange(sheet: ExcelJs.Worksheet, cellAddress: string): boolean {
    for (const mergeRange of sheet.model.merges || []) {
      if (mergeRange.includes(cellAddress)) {
        return true;
      }
    }
    return false;
  }

  findFirstEmptyCellInColumn(
    sheet: ExcelJs.Worksheet,
    column: string,
    startRow: number = 7,
    endRow: number = 14,
  ) {
    for (let i = startRow; i <= endRow; i++) {
      const cell = sheet.getCell(`${column}${i}`);
      const isEmpty =
        cell.value === null || cell.value === undefined || cell.value === '';
      const isMerged = this.isCellInMergedRange(sheet, `${column}${i}`);

      if (isEmpty && !isMerged) {
        return `${column}${i}`;
      }
    }

    return null;
  }

  async copyTemplateSheetFromFile(
    templatePath: string,
    targetWorkbook: ExcelJs.Workbook,
    newSheetName: string,
  ): Promise<ExcelJs.Worksheet> {
    const templateWorkbook = new ExcelJs.Workbook();
    await templateWorkbook.xlsx.readFile(templatePath);

    const templateSheet = templateWorkbook.worksheets[0]; // o por nombre
    const newSheet = targetWorkbook.addWorksheet(newSheetName);

    // Copy column widths
    templateSheet.columns?.forEach((col, idx) => {
      newSheet.getColumn(idx + 1).width = col.width;
    });

    // Copy row/cell values, styles, heights
    templateSheet.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(rowNumber);
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = newRow.getCell(colNumber);
        newCell.value = cell.value;
        newCell.style = { ...cell.style };
      });
      newRow.height = row.height;
    });

    // Copy merged cells
    (templateSheet.model.merges || []).forEach((mergeRange) => {
      newSheet.mergeCells(mergeRange);
    });

    return newSheet;
  }

  findSheetWithAvailableRow(
    workbook: ExcelJs.Workbook,
    column: string,
    startRow: number = 7,
    endRow: number = 14,
  ): ExcelJs.Worksheet | null {
    for (const sheet of workbook.worksheets) {
      for (let i = startRow; i <= endRow; i++) {
        const cell = sheet.getCell(`${column}${i}`);
        const isEmpty =
          cell.value === null || cell.value === undefined || cell.value === '';
        const isMerged = this.isCellInMergedRange(sheet, `${column}${i}`);

        if (isEmpty && !isMerged) {
          return sheet;
        }
      }
    }

    return null;
  }

  formateDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
}
