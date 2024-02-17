import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachments,
  QuestionAttachmentsProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function MakeQuestionAttachment(
  override: Partial<QuestionAttachmentsProps> = {},
  id?: UniqueEntityId,
) {
  const questionAttachments = QuestionAttachments.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return questionAttachments
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentsProps> = {},
  ): Promise<QuestionAttachments> {
    const questionAttachment = MakeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    })

    return questionAttachment
  }
}
