import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseProps {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { success: true; answerCommentId: string }
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseProps): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) return left(new ResourceNotFoundError())

    if (authorId !== answerComment.authorId.toString())
      return left(new NotAllowedError())

    await this.answerCommentsRepository.delete(answerComment)

    return right({
      success: true,
      answerCommentId: answerComment.id.toString(),
    })
  }
}
