import { InMemoryAttachmentssRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './erros/invalid-attachment-type.error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentssRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentssRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        attachment: inMemoryAttachmentsRepository.items[0],
      }),
    )
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'sample-upload.png',
      }),
    )
  })

  it('should not be able to upload and create an attachment with an invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.mp4',
      fileType: 'video/mp4',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
    expect(fakeUploader.uploads).toHaveLength(0)
  })
})
