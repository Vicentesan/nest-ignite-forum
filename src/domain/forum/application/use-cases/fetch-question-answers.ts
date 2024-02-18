import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswerWithAuthor } from '../../enterprise/entities/value-object/answer-with-author'
import { AnswersRepository } from '../repositories/answer-repository'

interface FetchQuestionsAnswersUseCaseProps {
  page: number
  questionId: string
}

type FetchQuestionsAnswersUseCaseResponse = Either<
  null,
  {
    success: boolean
    answers: AnswerWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsAnswersUseCaseProps): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionIdWithAuthor(
      questionId,
      {
        page,
      },
    )

    if (answers.length <= 0) return right({ success: false, answers })

    return right({ success: true, answers })
  }
}
