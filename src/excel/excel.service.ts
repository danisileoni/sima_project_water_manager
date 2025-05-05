import ExcelJs from 'exceljs';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TemplatesExcel } from './types/templates_excel';
import { ClientExcelDto } from './dto/clients-excel.dto';
import { ControlProductExcelDto } from './dto/control-product-excel.dto';
import { DispatchProductExcelDto } from './dto/dispatch-product-excel.dto';

/**
 * Servicio para manejar operaciones con archivos Excel
 * Permite crear archivos Excel mensuales a partir de plantillas,
 * agregar contenido a estos archivos y aplicar estilos consistentes.
 */
@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);
  
  // Constantes para configuración de Excel
  private readonly COLUMN_WIDTH = 12; // Equivalente a 1.00" en LibreOffice
  private readonly DEFAULT_START_ROW = 7;
  private readonly DEFAULT_END_ROW = 14;
  private readonly COLUMN_A_INDEX = 1;
  private readonly COLUMN_N_INDEX = 14;
  
  // Rutas comunes
  private readonly TEMP_DIR = path.join(process.cwd(), 'dist', 'excel', 'tempfiles');
  private readonly DIST_TEMPLATES_DIR = path.join(process.cwd(), 'dist', 'excel', 'templates');
  private readonly SRC_TEMPLATES_DIR = path.join(process.cwd(), 'src', 'excel', 'templates');
  
  // Columnas a verificar para filas vacías (específicas para cada tipo de plantilla)
  private readonly CLIENT_COLUMNS_TO_CHECK = ['A', 'C', 'E', 'G', 'H', 'I', 'L'];
  private readonly CONTROL_PRODUCT_COLUMNS_TO_CHECK = ['A', 'B', 'D', 'F', 'H', 'K'];
  private readonly DISPATCH_PRODUCT_COLUMNS_TO_CHECK = ['A', 'B', 'D', 'E', 'G', 'I', 'K', 'M'];

  constructor(
    @Inject('EXCEL_FILE_PATH')
    private readonly pathFolder: string,
  ) {}

  /**
   * Crea un nuevo libro de Excel
   */
  private createWorkbook(): Workbook {
    return new Workbook();
  }

  /**
   * Crea un nuevo archivo Excel a partir de una plantilla
   * @param template Plantilla a utilizar
   * @param date Fecha para determinar el nombre del archivo (mes/año)
   * @returns Nombre del archivo creado
   */
  async createNewFileExcel(template: TemplatesExcel, date?: Date): Promise<string> {
    const currentDate = date || new Date();
    
    // Crear nombre de archivo con formato YYYY-MM_template.xlsx
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const filenameTemplate = template.replace('_template.xlsx', '');
    const filename = `${year}-${month}_${filenameTemplate}.xlsx`;
    
    this.logger.log(`Creando nuevo archivo para ${month}/${year}: ${filename}`);

    // Buscar la plantilla en las ubicaciones posibles
    const templatePath = await this.findTemplatePath(template);
    
    // Asegurar que el directorio temporal existe
    await this.ensureTempDirectoryExists();
    
    const destinyPath = path.join(this.TEMP_DIR, filename);
    
    try {
      // Copiar la plantilla al archivo de destino
      this.logger.log(`Copiando de: ${templatePath} a: ${destinyPath}`);
      await fs.promises.copyFile(templatePath, destinyPath);
      return filename;
    } catch (error) {
      this.logger.error(`Error al copiar archivo: ${error.message}`, error.stack);
      throw new Error(`Error al crear archivo Excel: ${error.message}`);
    }
  }

  /**
   * Agrega datos de cliente a un archivo Excel
   * @param clientExcelDto Datos del cliente a agregar
   * @param fileName Nombre del archivo (opcional)
   * @returns true si se agregó correctamente
   */
  async addContentRawClient(clientExcelDto: ClientExcelDto, fileName?: string): Promise<boolean> {
    const {
      batch_of_product,
      contact,
      date,
      dni_cuit,
      name_or_company_name,
      observations,
      quantity,
    } = clientExcelDto;

    try {
      // Extraer fecha del DTO para determinar el archivo mensual
      const dateForFile = this.parseDateFromInput(date);
      
      // Preparar el libro Excel
      const workbook = this.createWorkbook();
      const filePath = await this.pathTempFile(fileName, TemplatesExcel.MontatyClients, dateForFile);
      await workbook.xlsx.readFile(filePath);

      // Preparar la hoja de trabajo
      let sheet = await this.getOrCreateSheet(workbook, TemplatesExcel.MontatyClients);

      // Valores a insertar
      const values: Record<string, string | number> = {
        A: name_or_company_name,
        C: dni_cuit,
        E: batch_of_product,
        G: quantity,
        H: date,
        I: contact,
        L: observations,
      };

      // Insertar datos en la hoja
      sheet = await this.insertDataIntoSheet(
        sheet, 
        values, 
        workbook, 
        TemplatesExcel.MontatyClients
      );

      // Actualizar fecha de emisión si es necesario
      this.updateEmissionDate(sheet);

      // Guardar archivo
      await workbook.xlsx.writeFile(filePath);
      this.logger.log(`Archivo guardado exitosamente en: ${filePath}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Error escribiendo datos del cliente en Excel: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  /**
   * Agrega datos de control de producto a un archivo Excel
   * @param controlProductExcelDto Datos de control de producto a agregar
   * @param fileName Nombre del archivo (opcional)
   * @returns true si se agregó correctamente
   */
  async addContentRawControlProduct(
    controlProductExcelDto: ControlProductExcelDto,
    fileName?: string,
  ): Promise<boolean> {
    const {
      batch_num,
      observations,
      production_date,
      quantity_enter,
      quantity_out,
      responsible,
    } = controlProductExcelDto;

    try {
      // Extraer fecha del DTO para determinar el archivo mensual
      const dateForFile = this.parseDateFromInput(production_date);
      
      // Preparar el libro Excel
      const workbook = this.createWorkbook();
      const filePath = await this.pathTempFile(fileName, TemplatesExcel.MontatyControlProduct, dateForFile);
      await workbook.xlsx.readFile(filePath);

      // Preparar la hoja de trabajo
      let sheet = await this.getOrCreateSheet(workbook, TemplatesExcel.MontatyControlProduct);

      // Valores a insertar
      const values: Record<string, string | number> = {
        A: production_date,
        B: batch_num,
        D: quantity_enter,
        F: quantity_out,
        H: responsible,
        K: observations,
      };

      // Insertar datos en la hoja
      sheet = await this.insertDataIntoSheet(
        sheet, 
        values, 
        workbook, 
        TemplatesExcel.MontatyControlProduct
      );

      // Actualizar fecha de emisión si es necesario
      this.updateEmissionDate(sheet);

      // Guardar archivo
      await workbook.xlsx.writeFile(filePath);
      this.logger.log(`Archivo guardado exitosamente en: ${filePath}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Error escribiendo datos de control de producto en Excel: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Agrega datos de despacho de producto a un archivo Excel
   * @param dispatchProductExcelDto Datos de despacho de producto a agregar
   * @param fileName Nombre del archivo (opcional)
   * @returns true si se agregó correctamente
   */
  async addContentRawDispatchProduct(
    dispatchProductExcelDto: DispatchProductExcelDto,
    fileName?: string,
  ): Promise<boolean> {
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
      // Extraer fecha del DTO para determinar el archivo mensual
      const dateForFile = this.parseDateFromInput(date);
      
      // Preparar el libro Excel
      const workbook = this.createWorkbook();
      const filePath = await this.pathTempFile(fileName, TemplatesExcel.MontatyDispatchProduct, dateForFile);
      await workbook.xlsx.readFile(filePath);

      // Preparar la hoja de trabajo
      let sheet = await this.getOrCreateSheet(workbook, TemplatesExcel.MontatyDispatchProduct);

      // Valores a insertar
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

      // Insertar datos en la hoja
      sheet = await this.insertDataIntoSheet(
        sheet, 
        values, 
        workbook, 
        TemplatesExcel.MontatyDispatchProduct
      );

      // Actualizar fecha de emisión si es necesario
      this.updateEmissionDate(sheet);

      // Guardar archivo
      await workbook.xlsx.writeFile(filePath);
      this.logger.log(`Archivo guardado exitosamente en: ${filePath}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Error escribiendo datos de despacho de producto en Excel: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtiene la ruta a un archivo temporal, creándolo si no existe
   * @param fileName Nombre del archivo (opcional)
   * @param templateType Tipo de plantilla
   * @param date Fecha para determinar el archivo mensual
   * @returns Ruta al archivo
   */
  async pathTempFile(
    fileName?: string, 
    templateType: TemplatesExcel = TemplatesExcel.MontatyClients, 
    date?: Date
  ): Promise<string> {
    // Asegurar que el directorio temporal existe
    await this.ensureTempDirectoryExists();

    // Si se proporciona un nombre de archivo específico, intentar usarlo
    if (fileName) {
      const filePath = path.join(this.TEMP_DIR, fileName);
      if (fs.existsSync(filePath)) {
        this.logger.log(`Usando archivo específico: ${fileName}`);
        return filePath;
      } else {
        this.logger.warn(`Archivo específico no encontrado: ${fileName}, buscando alternativas...`);
      }
    }

    // Usar la fecha proporcionada o la fecha actual
    const currentDate = date || new Date();
    
    // Crear patrón para buscar archivos del mes actual
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthPattern = `${year}-${month}_`;
    const templateName = templateType.replace('_template.xlsx', '');
    const monthFilePattern = `${monthPattern}${templateName}`;
    
    this.logger.log(`Buscando archivo para el mes ${month}/${year} con patrón: ${monthFilePattern}`);
    
    try {
      // Listar archivos en el directorio temporal
      const files = fs.readdirSync(this.TEMP_DIR).filter((name) => {
        const filePath = path.join(this.TEMP_DIR, name);
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
      });
      
      // Buscar archivo que coincida con el patrón del mes actual
      const monthFile = files.find(file => file.includes(monthFilePattern));
      
      if (monthFile) {
        // Si encontramos un archivo para el mes actual, usarlo
        this.logger.log(`Encontrado archivo para el mes actual: ${monthFile}`);
        return path.join(this.TEMP_DIR, monthFile);
      } else {
        // Si no encontramos un archivo para el mes actual, crear uno nuevo
        this.logger.log(`No se encontró archivo para el mes ${month}/${year}, creando uno nuevo...`);
        
        // Crear un nuevo archivo desde la plantilla para el mes actual
        const newFileName = await this.createNewFileExcel(templateType, currentDate);
        this.logger.log(`Nuevo archivo creado para ${month}/${year}: ${newFileName}`);
        
        return path.join(this.TEMP_DIR, newFileName);
      }
    } catch (error) {
      this.logger.error(`Error al buscar/crear archivo para el mes actual: ${error.message}`, error.stack);
      throw new Error(`Error al buscar/crear archivo para el mes actual: ${error.message}`);
    }
  }

  /**
   * Elimina todos los archivos dentro del directorio temporal
   */
  async clearTempFiles(): Promise<void> {
    try {
      if (!fs.existsSync(this.TEMP_DIR)) {
        this.logger.log('El directorio temporal no existe, nada que limpiar.');
        return;
      }

      const files = await fs.promises.readdir(this.TEMP_DIR);

      for (const file of files) {
        const filePath = path.join(this.TEMP_DIR, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
          await fs.promises.unlink(filePath);
          this.logger.log(`Archivo eliminado: ${file}`);
        }
      }

      this.logger.log('Todos los archivos temporales han sido eliminados.');
    } catch (error) {
      this.logger.error(`Error al limpiar archivos temporales: ${error.message}`, error.stack);
    }
  }

  // ==================== MÉTODOS PRIVADOS DE UTILIDAD ====================

  /**
   * Busca la ruta a una plantilla, primero en dist y luego en src
   * @param template Nombre de la plantilla
   * @returns Ruta a la plantilla
   */
  private async findTemplatePath(template: TemplatesExcel): Promise<string> {
    // Buscar primero en dist (producción)
    let templatePath = path.join(this.DIST_TEMPLATES_DIR, template);

    // Si no existe en dist, buscar en src (desarrollo)
    if (!fs.existsSync(templatePath)) {
      this.logger.warn('Template no encontrado en dist, buscando en src...');
      templatePath = path.join(this.SRC_TEMPLATES_DIR, template);
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template no encontrado: ${template}`);
      }
      this.logger.log('Template encontrado en src');
    }
    
    return templatePath;
  }

  /**
   * Asegura que el directorio temporal existe
   */
  private async ensureTempDirectoryExists(): Promise<void> {
    if (!fs.existsSync(this.TEMP_DIR)) {
      this.logger.warn('Directorio temporal no encontrado, creándolo...');
      try {
        await fs.promises.mkdir(this.TEMP_DIR, { recursive: true });
        this.logger.log('Directorio temporal creado exitosamente');
      } catch (error) {
        this.logger.error(`Error al crear directorio temporal: ${error.message}`, error.stack);
        throw new Error(`No se pudo crear el directorio temporal: ${error.message}`);
      }
    } else if (!fs.statSync(this.TEMP_DIR).isDirectory()) {
      // Si existe pero no es un directorio, renombrarlo y crear el directorio
      this.logger.warn('La ruta existe pero no es un directorio, renombrando...');
      try {
        const backupPath = `${this.TEMP_DIR}_backup_${Date.now()}`;
        await fs.promises.rename(this.TEMP_DIR, backupPath);
        await fs.promises.mkdir(this.TEMP_DIR, { recursive: true });
        this.logger.log(`Archivo renombrado a ${backupPath} y directorio creado exitosamente`);
      } catch (error) {
        this.logger.error(`Error al renombrar archivo y crear directorio: ${error.message}`, error.stack);
        throw new Error(`No se pudo crear el directorio temporal: ${error.message}`);
      }
    }
  }

  /**
   * Parsea una fecha de entrada en varios formatos posibles
   * @param dateInput Fecha de entrada (string o Date)
   * @returns Objeto Date
   */
  private  parseDateFromInput(dateInput: any): Date {
    let parsedDate = new Date();
    
    if (!dateInput) {
      return parsedDate;
    }
    
    try {
      if (typeof dateInput === 'string') {
        // Intentar varios formatos comunes de fecha
        if (dateInput.includes('-')) {
          const parts = dateInput.split('-');
          if (parts.length === 3) {
            // Formato DD-MM-YYYY o YYYY-MM-DD
            if (parts[0].length === 4) {
              // YYYY-MM-DD
              parsedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
              // DD-MM-YYYY
              parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            }
          }
        } else if (dateInput.includes('/')) {
          const parts = dateInput.split('/');
          if (parts.length === 3) {
            // Formato DD/MM/YYYY o MM/DD/YYYY
            if (parseInt(parts[0]) > 12) {
              // DD/MM/YYYY
              parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
              // MM/DD/YYYY o DD/MM/YYYY (asumiendo DD/MM/YYYY para este caso)
              parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            }
          }
        }
      } else if (typeof dateInput === 'object' && dateInput !== null && 
                Object.prototype.toString.call(dateInput) === '[object Date]') {
        parsedDate = dateInput as Date;
      }
    } catch (error) {
      this.logger.warn(`Error al parsear fecha "${dateInput}", usando fecha actual: ${error.message}`);
    }
    
    this.logger.log(`Fecha parseada para archivo: ${parsedDate.toISOString()}`);
    return parsedDate;
  }

  /**
   * Obtiene una hoja existente o crea una nueva
   * @param workbook Libro de Excel
   * @param templateType Tipo de plantilla
   * @returns Hoja de Excel
   */
  private async getOrCreateSheet(
    workbook: ExcelJs.Workbook, 
    templateType: TemplatesExcel
  ): Promise<ExcelJs.Worksheet> {
    // Buscar una hoja existente con espacio disponible
    let sheet = this.findSheetWithAvailableRow(workbook);

    if (sheet) {
      // Asegurar que la hoja existente tenga los bordes en las columnas A y N
      this.setBordersForColumns(sheet);
      this.logger.log(`Bordes aplicados a hoja existente: ${sheet.name}`);
    } else {
      this.logger.log('No se encontró hoja con espacio disponible, creando una nueva...');
      
      // Buscar la plantilla en las ubicaciones posibles
      let templatePath = path.join(this.SRC_TEMPLATES_DIR, templateType);
      
      // Si no existe en src, buscar en dist
      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(this.DIST_TEMPLATES_DIR, templateType);
      }
      
      // Obtener el índice de la última hoja
      const lastSheetIndex = workbook.worksheets.length;
      this.logger.log(`Creando nueva hoja con índice: ${lastSheetIndex + 1}`);
      
      // Crear nueva hoja a partir de la plantilla
      sheet = await this.copyTemplateSheetFromFile(templatePath, workbook);
    }
    
    return sheet;
  }

  /**
   * Inserta datos en una hoja de Excel
   * @param sheet Hoja de Excel
   * @param values Valores a insertar
   * @param workbook Libro de Excel
   * @param templateType Tipo de plantilla
   * @returns Hoja de Excel actualizada
   */
  private async insertDataIntoSheet(
    sheet: ExcelJs.Worksheet,
    values: Record<string, string | number>,
    workbook: ExcelJs.Workbook,
    templateType: TemplatesExcel
  ): Promise<ExcelJs.Worksheet> {
    // Buscar la siguiente fila disponible o crear una nueva hoja si es necesario
    const { row: rowNumber, sheet: activeSheet, isNewSheet } = await this.findFirstEmptyRow(
      sheet, 
      this.DEFAULT_START_ROW, 
      this.DEFAULT_END_ROW, 
      workbook, 
      templateType
    );
    
    // Si se creó una nueva hoja, actualizar la referencia
    if (isNewSheet) {
      sheet = activeSheet;
      this.logger.log(`Usando nueva hoja: ${sheet.name}`);
    } else {
      // Asegurar que la hoja existente tenga los bordes en las columnas A y N
      this.setBordersForColumns(sheet);
      this.logger.log(`Bordes aplicados a hoja existente: ${sheet.name}`);
    }
    
    this.logger.log(`Usando fila ${rowNumber} para insertar datos`);
    
    // Insertar valores en la misma fila
    for (const column in values) {
      const value = values[column];
      const cellAddress = `${column}${rowNumber}`;
      this.logger.log(`Escribiendo "${value}" en celda ${cellAddress}`);
      sheet.getCell(cellAddress).value = value;
    }
    
    return sheet;
  }

  /**
   * Actualiza la fecha de emisión en una hoja si no existe
   * @param sheet Hoja de Excel
   */
  private updateEmissionDate(sheet: ExcelJs.Worksheet): void {
    try {
      const valueEmissionCell = sheet.getCell('J3');
      const valueEmission = valueEmissionCell.value === null
        ? ''
        : valueEmissionCell.value.toString();

      const regex = /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/;
      const contentDate = regex.test(valueEmission);

      if (!contentDate) {
        const date = new Date();
        const formattedDate = this.formatDate(date);
        valueEmissionCell.value = `${valueEmission} ${formattedDate}`;
        this.logger.log(`Fecha de emisión actualizada: ${valueEmissionCell.value}`);
      }
    } catch (error) {
      this.logger.error(`Error al actualizar fecha de emisión: ${error.message}`, error.stack);
    }
  }

  /**
   * Formatea una fecha en formato DD-MM-YYYY
   * @param date Fecha a formatear
   * @returns Fecha formateada
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  /**
   * Verifica si una celda está vacía
   * @param cell Celda a verificar
   * @returns true si la celda está vacía
   */
  private isCellEmpty(cell: ExcelJs.Cell): boolean {
    return (
      cell.value === null ||
      cell.value === undefined ||
      cell.value === '' ||
      (typeof cell.value === 'object' &&
        cell.value &&
        'text' in cell.value &&
        cell.value.text === '')
    );
  }

  /**
   * Verifica si una celda está dentro de un rango fusionado
   * @param sheet Hoja de Excel
   * @param cellAddress Dirección de la celda
   * @returns true si la celda está en un rango fusionado
   */
  private isCellInMergedRange(sheet: ExcelJs.Worksheet, cellAddress: string): boolean {
    if (!sheet.model.merges) return false;

    // Parsear la dirección de la celda a coordenadas numéricas
    const addressParts = cellAddress.match(/([A-Z]+)(\d+)/);
    if (!addressParts) return false;

    const col = this.columnNameToNumber(addressParts[1]);
    const row = parseInt(addressParts[2], 10);

    // Comprobar si la celda está dentro de algún rango fusionado
    for (const mergeRange of sheet.model.merges) {
      const rangeStr = mergeRange.toString(); // Formato: "A1:B2"
      const [start, end] = rangeStr.split(':');

      if (!start || !end) continue;

      const startParts = start.match(/([A-Z]+)(\d+)/);
      const endParts = end.match(/([A-Z]+)(\d+)/);

      if (!startParts || !endParts) continue;

      const startCol = this.columnNameToNumber(startParts[1]);
      const startRow = parseInt(startParts[2], 10);
      const endCol = this.columnNameToNumber(endParts[1]);
      const endRow = parseInt(endParts[2], 10);

      if (
        row >= startRow &&
        row <= endRow &&
        col >= startCol &&
        col <= endCol
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Convierte un nombre de columna (A, B, AA, etc.) a número
   * @param columnName Nombre de la columna
   * @returns Número de la columna
   */
  private columnNameToNumber(columnName: string): number {
    let result = 0;
    for (let i = 0; i < columnName.length; i++) {
      result = result * 26 + columnName.charCodeAt(i) - 64;
    }
    return result;
  }

  /**
   * Busca la primera fila vacía en una hoja
   * @param sheet Hoja de Excel
   * @param startRow Fila inicial
   * @param endRow Fila final
   * @param workbook Libro de Excel
   * @param templateType Tipo de plantilla
   * @returns Información sobre la fila encontrada
   */
  private async findFirstEmptyRow(
    sheet: ExcelJs.Worksheet,
    startRow: number = this.DEFAULT_START_ROW,
    endRow: number = this.DEFAULT_END_ROW,
    workbook?: ExcelJs.Workbook,
    templateType?: TemplatesExcel
  ): Promise<{ row: number; sheet: ExcelJs.Worksheet; isNewSheet: boolean }> {
    // Primero, encontrar la última fila con datos
    let lastRowWithData = startRow - 1; // Iniciar en la fila anterior a la primera fila de datos
    let allRowsFilled = true;
    
    // Determinar qué columnas verificar según el tipo de plantilla
    let columnsToCheck = this.CLIENT_COLUMNS_TO_CHECK; // Por defecto, usar columnas de cliente
    
    if (templateType) {
      switch (templateType) {
        case TemplatesExcel.MontatyControlProduct:
          columnsToCheck = this.CONTROL_PRODUCT_COLUMNS_TO_CHECK;
          break;
        case TemplatesExcel.MontatyDispatchProduct:
          columnsToCheck = this.DISPATCH_PRODUCT_COLUMNS_TO_CHECK;
          break;
        case TemplatesExcel.MontatyClients:
        default:
          columnsToCheck = this.CLIENT_COLUMNS_TO_CHECK;
          break;
      }
    }
    
    // Solo verificar las filas dentro del rango permitido (startRow a endRow)
    for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
      // Verificar si alguna celda en esta fila tiene datos
      const hasData = columnsToCheck.some(column => {
        const cell = sheet.getCell(`${column}${rowNum}`);
        return !this.isCellEmpty(cell);
      });
      
      if (hasData) {
        lastRowWithData = rowNum;
      } else {
        allRowsFilled = false; // Encontramos al menos una fila vacía
      }
    }
    
    // La siguiente fila disponible es la última fila con datos + 1
    const nextAvailableRow = lastRowWithData + 1;
    
    // Verificar que la siguiente fila disponible no exceda el límite
    if (nextAvailableRow <= endRow) {
      this.logger.log(`Siguiente fila disponible: ${nextAvailableRow} en hoja: ${sheet.name}`);
      return { row: nextAvailableRow, sheet, isNewSheet: false };
    } else if (allRowsFilled && workbook && templateType) {
      // Si la hoja actual está llena, crear una nueva hoja
      this.logger.log(`Hoja actual ${sheet.name} está llena, creando una nueva hoja...`);
      
      // Buscar la plantilla en las ubicaciones posibles
      let templatePath = path.join(this.SRC_TEMPLATES_DIR, templateType);
      
      // Si no existe en src, buscar en dist
      if (!fs.existsSync(templatePath)) {
        templatePath = path.join(this.DIST_TEMPLATES_DIR, templateType);
      }
      
      this.logger.log(`Usando template: ${templateType} para nueva hoja`);
      
      // Crear nueva hoja a partir de la plantilla
      const newSheet = await this.copyTemplateSheetFromFile(templatePath, workbook);
      
      return { row: startRow, sheet: newSheet, isNewSheet: true };
    } else {
      // Si no podemos crear una nueva hoja, volver a la primera fila
      this.logger.log(`Se alcanzó el límite de filas (${endRow}), usando la primera fila`);
      return { row: startRow, sheet, isNewSheet: false };
    }
  }

  /**
   * Busca una hoja con filas disponibles en un libro
   * @param workbook Libro de Excel
   * @param columnToCheck Columna a verificar para determinar si hay filas disponibles
   * @returns Hoja de Excel con filas disponibles o null si no se encuentra
   */
  private findSheetWithAvailableRow(
    workbook: ExcelJs.Workbook,
    columnToCheck: string = 'A'
  ): ExcelJs.Worksheet | null {
    // Verificar todas las hojas existentes
    for (const sheet of workbook.worksheets) {
      this.logger.log(`Verificando disponibilidad en hoja: ${sheet.name}`);
      
      // Buscar la primera fila vacía en esta hoja
      let foundEmptyRow = false;
      
      // Verificar filas dentro del rango permitido
      for (let rowNum = this.DEFAULT_START_ROW; rowNum <= this.DEFAULT_END_ROW; rowNum++) {
        const cell = sheet.getCell(`${columnToCheck}${rowNum}`);
        
        if (this.isCellEmpty(cell)) {
          foundEmptyRow = true;
          this.logger.log(`Encontrada fila vacía ${rowNum} en hoja: ${sheet.name}`);
          break;
        }
      }
      
      if (foundEmptyRow) {
        return sheet;
      }
    }
    
    this.logger.log('No se encontró ninguna hoja con filas disponibles');
    return null;
  }

  /**
   * Establece los bordes para las columnas A y N en una hoja
   * @param sheet Hoja de Excel
   * @param startRow Fila inicial
   * @param endRow Fila final
   */
  private setBordersForColumns(
    sheet: ExcelJs.Worksheet,
    startRow: number = 1,
    endRow: number = this.DEFAULT_END_ROW
  ): void {
    this.logger.log(`Aplicando bordes a columnas A y N en hoja: ${sheet.name}`);
    
    // Aplicar bordes a cada celda de las columnas A y N
    for (let row = startRow; row <= endRow; row++) {
      // Aplicar borde a columna A (borde izquierdo)
      const cellA = sheet.getCell(row, this.COLUMN_A_INDEX);
      if (!cellA.style.border) {
        cellA.style.border = {};
      }
      cellA.style.border.left = { style: 'thin' };
      
      // Aplicar borde a columna N (borde derecho)
      const cellN = sheet.getCell(row, this.COLUMN_N_INDEX);
      if (!cellN.style.border) {
        cellN.style.border = {};
      }
      cellN.style.border.right = { style: 'thin' };
    }
    
    this.logger.log(`Bordes aplicados correctamente a columnas A y N`);
  }

  /**
   * Copia una hoja de plantilla a un libro de Excel
   * @param templatePath Ruta a la plantilla
   * @param targetWorkbook Libro de Excel de destino
   * @returns Hoja de Excel copiada
   */
  private async copyTemplateSheetFromFile(
    templatePath: string,
    targetWorkbook: ExcelJs.Workbook,
  ): Promise<ExcelJs.Worksheet> {
    this.logger.log(`Copiando hoja de plantilla desde: ${templatePath}`);
    
    // Crear un nuevo libro para cargar la plantilla
    const templateWorkbook = new Workbook();
    templateWorkbook.xlsx.readFile(templatePath);
    
    // Esperar a que se cargue la plantilla
    await templateWorkbook.xlsx.readFile(templatePath);
    
    // Obtener la primera hoja de la plantilla
    const templateSheet = templateWorkbook.worksheets[0];
    
    // Crear una nueva hoja en el libro de destino
    const newSheetName = `Hoja${targetWorkbook.worksheets.length + 1}`;
    const newSheet = targetWorkbook.addWorksheet(newSheetName);
    
    // Copiar propiedades de la hoja
    newSheet.properties = { ...templateSheet.properties, tabColor: templateSheet.properties?.tabColor };
    
    // Establecer un ancho fijo para todas las columnas
    const totalColumns = templateSheet.columnCount || 20;
    this.logger.log(`Estableciendo ancho de ${this.COLUMN_WIDTH} unidades para ${totalColumns} columnas`);
    
    for (let columnNumber = 1; columnNumber <= totalColumns; columnNumber++) {
      const newColumn = newSheet.getColumn(columnNumber);
      newColumn.width = this.COLUMN_WIDTH;
      this.logger.log(`Columna ${columnNumber}: ancho establecido a ${this.COLUMN_WIDTH} unidades`);
      
      // Copiar otras propiedades de la columna si existen
      const templateColumn = templateSheet.getColumn(columnNumber);
      if (templateColumn.style) {
        newColumn.style = { ...templateColumn.style };
      }
    }
    
    // Copiar celdas y estilos, pero vaciar valores si son campos a llenar
    templateSheet.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(rowNumber);
      
      // Asegurar que la altura de la fila se copia exactamente
      if (row.height) {
        newRow.height = row.height;
        this.logger.log(`Copiando altura de fila ${rowNumber}: ${row.height}`);
      }
      
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = newRow.getCell(colNumber);
  
        // Detectar si es un campo rellenable por plantilla (por ejemplo: {{nombre}})
        const isPlaceholder = typeof cell.value === 'string' && /\{\{.*\}\}/.test(cell.value);
  
        // Copiar el valor (o dejarlo vacío si es un placeholder)
        newCell.value = isPlaceholder ? null : cell.value;
        
        // Copiar todos los aspectos del estilo de la celda
        if (cell.style) {
          // Copiar el estilo completo
          newCell.style = JSON.parse(JSON.stringify(cell.style));
          
          // Asegurar que se copian correctamente las propiedades de fuente
          if (cell.style.font) {
            newCell.font = { ...cell.style.font };
          }
          
          // Asegurar que se copian correctamente los bordes
          if (cell.style.border) {
            newCell.border = { ...cell.style.border };
          }
          
          // Asegurar que se copia el relleno/color de fondo
          if (cell.style.fill) {
            newCell.fill = { ...cell.style.fill };
          }
          
          // Asegurar que se copia la alineación
          if (cell.style.alignment) {
            newCell.alignment = { ...cell.style.alignment };
          }
        }
        
        // Asegurar que la columna N tenga borde derecho
        if (colNumber === this.COLUMN_N_INDEX) {
          if (!newCell.style.border) {
            newCell.style.border = {};
          }
          newCell.style.border.right = { style: 'thin' };
        }
        
        // Asegurar que la columna A tenga borde izquierdo
        if (colNumber === this.COLUMN_A_INDEX) {
          if (!newCell.style.border) {
            newCell.style.border = {};
          }
          newCell.style.border.left = { style: 'thin' };
        }
      });
    });
    
    // Copiar fusiones de celdas
    if (templateSheet.model.merges) {
      templateSheet.model.merges.forEach(merge => {
        newSheet.mergeCells(merge);
      });
    }
    
    // Buscar y copiar el logo si existe
    const logoPath = path.join(this.SRC_TEMPLATES_DIR, 'montaty_logo.png');
    if (fs.existsSync(logoPath)) {
      try {
        const logoId = targetWorkbook.addImage({
          filename: logoPath,
          extension: 'png',
        });
        
        // Intentar agregar el logo en la misma posición que en la plantilla
        newSheet.addImage(logoId, {
          tl: { col: 0.5, row: 0.5 },
          ext: { width: 100, height: 50 },
        });
        
        this.logger.log('Logo agregado correctamente');
      } catch (error) {
        this.logger.warn(`Error al agregar logo: ${error.message}`);
      }
    } else {
      this.logger.warn('Logo no encontrado en ninguna ruta');
    }
    
    // Aplicar manualmente los bordes a las columnas A y N
    this.setBordersForColumns(newSheet);
    this.logger.log('Bordes aplicados manualmente a columnas A y N');
  
    return newSheet;
  }
}
