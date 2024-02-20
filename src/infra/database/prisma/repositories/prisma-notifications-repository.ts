import { PaginationParams } from '@/core/repositories/pagination-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notifications-mapper'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(notification: Notification): Promise<void> {
    await this.prisma.notification.delete({
      where: {
        id: notification.id.toString(),
      },
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Notification[]> {
    const perPage = 20

    const notifications = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return notifications.map(PrismaNotificationMapper.toDomain)
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    if (!notification) return null

    return PrismaNotificationMapper.toDomain(notification)
  }
}
