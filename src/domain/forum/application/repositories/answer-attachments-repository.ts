import { AnswerAttachments } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachments[]>
}
