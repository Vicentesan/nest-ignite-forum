import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentsProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AnswerAttachments extends Entity<AnswerAttachmentsProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentsProps, id?: UniqueEntityId) {
    const answerAttachments = new AnswerAttachments(props, id)

    return answerAttachments
  }
}
