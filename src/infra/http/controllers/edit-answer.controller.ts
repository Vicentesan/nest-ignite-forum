import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { z } from 'zod'

const editAnswersBodySchema = z.object({
  content: z.string(),
  attachments: z.string().uuid().array(),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswersBodySchema)

export type EditAnswersBodySchema = z.infer<typeof editAnswersBodySchema>

@Controller('/answers/:id')
export class EditAnswersController {
  constructor(private editAnswers: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAnswersBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { sub: userId } = user
    const { content, attachments } = body

    const result = await this.editAnswers.execute({
      answerId,
      authorId: userId,
      content,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
