import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'

interface FetchAnswerCommentsUseCaseProps {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    success: boolean
    answerComments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseProps): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      )

    if (answerComments.length <= 0)
      return right({ success: false, answerComments })

    return right({ success: true, answerComments })
  }
}
