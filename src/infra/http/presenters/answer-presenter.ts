import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static present(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
