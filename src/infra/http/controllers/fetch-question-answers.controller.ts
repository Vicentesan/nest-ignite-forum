import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { FetchQuestionsAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { z } from 'zod'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type PageQuerySchema = z.infer<typeof pageQuerySchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionsAnswersUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      questionId,
      page,
    })

    if (result.isLeft()) throw new BadRequestException()

    const { success, answers } = result.value

    return { success, answers: answers.map(AnswerPresenter.present) }
  }
}
