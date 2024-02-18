import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface AnswerWithAuthorProps {
  answerId: UniqueEntityId
  content: string
  authorId: UniqueEntityId
  authorName: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerWithAuthor extends ValueObject<AnswerWithAuthorProps> {
  get answerId() {
    return this.props.answerId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: AnswerWithAuthorProps) {
    return new AnswerWithAuthor(props)
  }
}
