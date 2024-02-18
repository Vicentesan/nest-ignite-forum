import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type PageQuerySchema = z.infer<typeof pageQuerySchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', queryValidationPipe) page: PageQuerySchema,
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page,
    })

    if (result.isLeft()) throw new BadRequestException()

    const { success, questionComments } = result.value

    return {
      success,
      questionId,
      questionComments: questionComments.map(
        CommentWithAuthorPresenter.present,
      ),
    }
  }
}
