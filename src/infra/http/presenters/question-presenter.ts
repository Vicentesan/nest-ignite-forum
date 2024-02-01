import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static present(question: Question) {
    return {
      id: question.id.toString(),
      slug: question.slug.value,
      title: question.title,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
