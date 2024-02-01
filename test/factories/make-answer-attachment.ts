import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachments,
  AnswerAttachmentsProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

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
