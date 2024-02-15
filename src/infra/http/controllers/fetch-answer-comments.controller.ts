import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type PageQuerySchema = z.infer<typeof pageQuerySchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query('page', queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page,
    })

    if (result.isLeft()) throw new BadRequestException()

    const { success, answerComments } = result.value

    return {
      success,
      answerId,
      answerComments: answerComments.map(CommentPresenter.present),
    }
  }
}
