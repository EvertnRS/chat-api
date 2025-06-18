export interface IStorageProvider {
  uploadFile(params: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    folder?: string;
  }): Promise<string>;

  updateFile(params: {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    oldFileUrl: string;
  }): Promise<string>;

  deleteFile(fileUrl: string): Promise<void>;

  getFile(fileUrl: string): Promise<string>;
}
