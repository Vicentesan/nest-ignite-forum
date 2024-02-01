import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answer-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteAnswerUseCaseProps {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    success: boolean
    answerId: string
  }
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseProps): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    if (authorId !== answer.authorId.toString())
      return left(new NotAllowedError())

    await this.answersRepository.delete(answer)

    return right({ success: true, answerId: answer.id.toString() })
  }
}
