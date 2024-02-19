import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static present(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      slug: questionDetails.slug.value,
      title: questionDetails.title,
      content: questionDetails.content,
      attachments: questionDetails.attachments.map(AttachmentPresenter.present),
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.authorName,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
