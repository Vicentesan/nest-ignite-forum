import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Delete, Param } from '@nestjs/common'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { sub: userId } = user

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
