import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachments,
  AnswerAttachmentsProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function MakeAnswerAttachment(
  override: Partial<AnswerAttachmentsProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachments = AnswerAttachments.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answerAttachments
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentsProps> = {},
  ): Promise<AnswerAttachments> {
    const answerAttachment = MakeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    })

    return answerAttachment
  }
}
