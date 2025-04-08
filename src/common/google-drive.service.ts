import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class GoogleDriveService {
  private drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'src/config/google-service.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(filePath: string, fileName: string, mimeType: string) {
    const fileMetadata = { name: fileName };
    const media = { mimeType, body: fs.createReadStream(filePath) };

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    return { fileId: response.data.id };
  }

  async downloadFile(fileId: string, destinationPath: string) {
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    );

    const dest = fs.createWriteStream(destinationPath);
    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => resolve(`complete download: ${destinationPath}`))
        .on('error', (err) => reject(`Error download: ${err}`))
        .pipe(dest);
    });
  }

  async deleteFile(fileId: string) {
    await this.drive.files.delete({ fileId });
    return { message: `File ${fileId} deleted successfully` };
  }

  async replaceFile(fileId: string, filePath: string, mimeType: string) {
    const media = { mimeType, body: fs.createReadStream(filePath) };

    const response = await this.drive.files.update({
      fileId,
      media,
      fields: 'id',
    });

    return {
      fileId: response.data.id,
      message: 'File replaced successfully',
    };
  }
}
