import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseProps {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    success: boolean
    questionCommentId: string
  }
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseProps): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) return left(new ResourceNotFoundError())

    if (authorId !== questionComment.authorId.toString())
      return left(new NotAllowedError())

    await this.questionCommentsRepository.delete(questionComment)

    return right({
      success: true,
      questionCommentId: questionComment.id.toString(),
    })
  }
}
