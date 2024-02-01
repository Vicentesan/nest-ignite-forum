import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachments } from '@/domain/forum/enterprise/entities/answer-attachment'
export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachments[] = []

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    this.items = answerAttachments
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }
}
