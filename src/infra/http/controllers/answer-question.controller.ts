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

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.string().uuid().array(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { sub: userId } = user
    const { content, attachments } = body

    const result = await this.answerQuestion.execute({
      questionId,
      authorId: userId,
      content,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
