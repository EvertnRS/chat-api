import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

  async updateFile({ fileBuffer, fileName, mimeType, oldFileUrl }: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    oldFileUrl: string;
  }): Promise<string> {

    const extension = path.extname(fileName);
    let newKey: string;

    if (oldFileUrl && oldFileUrl.trim() !== '') {
      const url = new URL(oldFileUrl);
      const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
      newKey = `${path.dirname(key)}/${uuidv4()}${extension}`;

      await this.client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: newKey,
        Body: fileBuffer,
        ContentType: mimeType
      }));
      await this.deleteFile(oldFileUrl);

    } else {
      newKey = `${uuidv4()}${extension}`;


      await this.client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: newKey,
        Body: fileBuffer,
        ContentType: mimeType
      }));
    }

    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newKey}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (fileUrl && fileUrl.trim() !== '') {
      const bucketUrlPrefix = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/`;
      const key = fileUrl.replace(bucketUrlPrefix, '');

      await this.client.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key
      }));
    }
  }

  async getFile(fileUrl: string): Promise<string> {
    const key = fileUrl.split('.com/')[1];

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key
    });

    const url = await getSignedUrl(this.client, command, {});

    return url;
  }
}
