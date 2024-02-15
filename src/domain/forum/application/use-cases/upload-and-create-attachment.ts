import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './erros/invalid-attachment-type.error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseProps {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    success: boolean
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseProps): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType))
      return left(new InvalidAttachmentTypeError(fileType))

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      success: true,
      attachment,
    })
  }
}
