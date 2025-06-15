export interface IStorageProvider {
  uploadFile(params: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    folder?: string;
  }): Promise<string>;
}
