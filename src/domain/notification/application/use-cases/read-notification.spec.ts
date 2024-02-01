import { MakeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = MakeNotification()

    inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      newNotification.readAt,
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const newNotification = MakeNotification({
      recipientId: new UniqueEntityId(),
    })

    inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: 'diff-recipient',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
