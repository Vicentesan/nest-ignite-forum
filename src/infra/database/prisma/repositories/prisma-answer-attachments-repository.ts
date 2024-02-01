import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachments } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByAnswerId(answerId: string): Promise<AnswerAttachments[]> {
    throw new Error('Method not implemented.')
  }
}
