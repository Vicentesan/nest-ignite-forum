export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(UploadParams): Promise<{ url: string }>
}
