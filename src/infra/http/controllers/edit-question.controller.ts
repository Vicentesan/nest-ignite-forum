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

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.string().uuid().array(),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { sub: userId } = user
    const { title, content, attachments } = body

    const result = await this.editQuestion.execute({
      questionId,
      authorId: userId,
      title,
      content,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
