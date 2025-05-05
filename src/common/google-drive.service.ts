import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleDriveService implements OnModuleInit {
  private drive: drive_v3.Drive;

  async onModuleInit() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '../config/google-service.json'),
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      const authClient = (await auth.getClient()) as any;

      this.drive = google.drive({
        version: 'v3',
        auth: authClient,
      });

      console.log('[GoogleDrive] Authenticated successfully');
    } catch (error) {
      console.error(
        '[GoogleDrive] Failed to initialize Google Drive:',
        error.message,
      );
    }
  }

  // method verify if file exists in google drive
  async fileExists(fileId: string): Promise<boolean> {
    try {
      if (!fileId) {
        console.log('⚠️ No se proporcionó un ID de archivo válido');
        return false;
      }
      
      console.log(`🔍 Verificando si existe el archivo en Google Drive (ID: ${fileId})`);
      const response = await this.drive.files.get({
        fileId,
        fields: 'id,name',
      });
      console.log(`✅ Archivo encontrado: ${response.data.name} (ID: ${response.data.id})`);
      return true;
    } catch (error) {
      if (error.code === 404) {
        console.log(`❌ Archivo no encontrado en Google Drive (ID: ${fileId})`);
        return false;
      }
      console.error(`❌ Error al verificar archivo en Google Drive:`, error);
      return false; // Devolver false en caso de error para evitar que la aplicación falle
    }
  }

  // Método para listar archivos en Google Drive
  async listFiles(pageSize: number = 10): Promise<any[]> {
    try {
      console.log(`📋 Listando archivos en Google Drive (max: ${pageSize})`);
      const response = await this.drive.files.list({
        pageSize,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, size)',
      });

      const files = response.data.files || [];
      console.log(`✅ Se encontraron ${files.length} archivos en Google Drive`);
      
      // Imprimir información de los archivos
      files.forEach((file, index) => {
        console.log(`📄 ${index + 1}. ${file.name} (ID: ${file.id}, Tipo: ${file.mimeType})`);
      });
      
      return files;
    } catch (error) {
      console.error('❌ Error al listar archivos en Google Drive:', error);
      return [];
    }
  }

  async uploadFile(
    filePath: string,
    mimeType: string,
    folderId?: string, // opcional: ID del folder de Drive
  ) {
    try {
      // Obtener el nombre del archivo del path
      const fileName = path.basename(filePath);
      console.log(`📤 Subiendo archivo: ${fileName}`);

      const fileMetadata: any = { name: fileName };
      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = { mimeType, body: fs.createReadStream(filePath) };

      const response = await this.drive.files.create(
        {
          requestBody: fileMetadata,
          media,
          fields: 'id,name',
        },
        {
          timeout: 60000,
        },
      );

      console.log(`✅ Archivo subido exitosamente: ${response.data.name} (ID: ${response.data.id})`);
      return response.data.id;
    } catch (error) {
      console.error('❌ Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string, destinationPath: string, fileName?: string) {
    try {
      // Primero, obtener información del archivo para saber su nombre si no se proporciona
      let actualFileName = fileName;
      if (!actualFileName) {
        const fileInfo = await this.drive.files.get({
          fileId,
          fields: 'name',
        });
        actualFileName = fileInfo.data.name;
      }

      // Verificar si destinationPath es un directorio
      const stats = fs.existsSync(destinationPath) ? fs.statSync(destinationPath) : null;
      
      // Si es un directorio, añadir el nombre del archivo
      const finalPath = stats && stats.isDirectory() 
        ? path.join(destinationPath, actualFileName)
        : destinationPath;
      
      // Asegurarse de que el directorio existe
      const dir = path.dirname(finalPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      console.log(`📥 Descargando archivo a: ${finalPath}`);
      
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );

      const dest = fs.createWriteStream(finalPath);
      return new Promise((resolve, reject) => {
        response.data
          .on('end', () => {
            console.log(`✅ Descarga completa: ${finalPath}`);
            resolve(finalPath);
          })
          .on('error', (err) => {
            console.error(`❌ Error al descargar: ${err}`);
            reject(`Error downloading: ${err}`);
          })
          .pipe(dest);
      });
    } catch (error) {
      console.error('❌ Error en downloadFile:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      console.log(`🗑️ Eliminando archivo de Google Drive (ID: ${fileId})`);
      await this.drive.files.delete({ fileId });
      console.log(`✅ Archivo eliminado exitosamente (ID: ${fileId})`);
      return { message: `File ${fileId} deleted successfully` };
    } catch (error) {
      console.error(`❌ Error al eliminar archivo de Google Drive:`, error);
      throw error;
    }
  }

  async replaceFile(fileId: string, filePath: string, mimeType: string) {
    try {
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        console.error(`❌ El archivo no existe: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
      }

      // Obtener el nombre del archivo del path
      const fileName = path.basename(filePath);
      console.log(`🔄 Reemplazando archivo en Google Drive: ${fileName} (ID: ${fileId})`);

      const media = { mimeType, body: fs.createReadStream(filePath) };

      // También actualizar el nombre del archivo si es necesario
      const response = await this.drive.files.update({
        fileId,
        requestBody: {
          name: fileName,
        },
        media,
        fields: 'id,name',
      });

      console.log(`✅ Archivo reemplazado exitosamente: ${response.data.name} (ID: ${response.data.id})`);
      return {
        fileId: response.data.id,
        fileName: response.data.name,
        message: 'File replaced successfully',
      };
    } catch (error) {
      console.error('❌ Error al reemplazar archivo en Google Drive:', error);
      throw error;
    }
  }
}
