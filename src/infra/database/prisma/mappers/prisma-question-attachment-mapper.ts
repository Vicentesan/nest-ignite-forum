import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachments } from '@/domain/forum/enterprise/entities/question-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachments {
    if (!raw.questionId) throw new Error('Invalid attachment type')

    return QuestionAttachments.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
