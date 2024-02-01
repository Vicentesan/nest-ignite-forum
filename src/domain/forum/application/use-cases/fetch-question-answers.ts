import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answer-repository'

interface FetchQuestionsAnswersUseCaseProps {
  page: number
  questionId: string
}

type FetchQuestionsAnswersUseCaseResponse = Either<
  null,
  {
    success: boolean
    answers: Answer[]
  }
>

export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionsAnswersUseCaseProps): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    if (answers.length <= 0) return right({ success: false, answers })

    return right({ success: true, answers })
  }
}
