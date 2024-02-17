import { QuestionAttachments } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachments[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachments[]): Promise<void>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachments[]>
}
