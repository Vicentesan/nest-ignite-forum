import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface SendNotificationUseCaseProps {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    success: boolean
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseProps): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({
      success: true,
      notification,
    })
  }
}
