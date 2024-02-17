import { AnswerAttachments } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachments[]): Promise<void>
  abstract deleteMany(attachments: AnswerAttachments[]): Promise<void>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachments[]>
}
