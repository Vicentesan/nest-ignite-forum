import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentsProps {
  questionId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttachments extends Entity<QuestionAttachmentsProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentsProps, id?: UniqueEntityId) {
    const questionAttachment = new QuestionAttachments(props, id)

    return questionAttachment
  }
}
