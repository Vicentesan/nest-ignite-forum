import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'

export class AnswerWithAuthorPresenter {
  static present(answerWithAutor: AnswerWithAuthor) {
    return {
      answerId: answerWithAutor.answerId.toString(),
      content: answerWithAutor.content,
      authorId: answerWithAutor.authorId.toString(),
      authorName: answerWithAutor.authorName,
      createdAt: answerWithAutor.createdAt,
      updatedAt: answerWithAutor.updatedAt,
    }
  }
}
