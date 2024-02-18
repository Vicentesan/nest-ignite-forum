import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachments } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachments {
    if (!raw.answerId) throw new Error('Invalid attachment type')

    return AnswerAttachments.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachments[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    }
  }
}
