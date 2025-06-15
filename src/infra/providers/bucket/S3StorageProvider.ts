// src/infra/providers/s3/S3StorageProvider.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IStorageProvider } from './IStorageProvider';

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile({ fileBuffer, fileName, mimeType, folder = 'uploads' }: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    folder?: string;
  }): Promise<string> {
    const extension = path.extname(fileName);
    const key = `${folder}/${uuidv4()}${extension}`;

    await this.client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    }));

    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }
}
