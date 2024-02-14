import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { z } from 'zod'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

export type CommentOnAnswerBodySchema = z.infer<
  typeof commentOnAnswerBodySchema
>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId: userId,
      content,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
