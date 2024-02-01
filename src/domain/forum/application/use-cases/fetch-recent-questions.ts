import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionsUseCaseProps {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    success: boolean
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseProps): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    if (questions.length <= 0) return right({ success: false, questions })

    return right({ success: true, questions })
  }
}
