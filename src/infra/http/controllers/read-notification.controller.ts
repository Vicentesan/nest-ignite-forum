import { BadRequestException, Controller, Param, Patch } from '@nestjs/common'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') id: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId: id,
      recipientId: user.sub,
    })

    if (result.isLeft()) throw new BadRequestException()

    const { success, notificationId } = result.value

    return { success, notificationId }
  }
}
