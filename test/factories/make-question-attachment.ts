import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachments,
  QuestionAttachmentsProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

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
