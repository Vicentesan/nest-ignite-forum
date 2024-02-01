import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answer-repository'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseProps {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    success: boolean
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseProps): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) return left(new ResourceNotFoundError())

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError())

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({ success: true, question })
  }
}
