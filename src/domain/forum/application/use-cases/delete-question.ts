import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteQuestionUseCaseProps {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    success: boolean
    questionId: string
  }
>
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseProps): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError())

    await this.questionsRepository.delete(question)

    return right({ success: true, questionId: question.id.toString() })
  }
}
