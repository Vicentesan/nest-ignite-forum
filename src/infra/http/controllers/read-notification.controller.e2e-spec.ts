import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'
import { NotificationFactory } from 'test/factories/make-notification'

import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

let app: INestApplication
let jwt: JwtService
let prisma: PrismaService
let studentFactory: StudentFactory
let notificationFactory: NotificationFactory

describe('Read Notification Controller (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const newNotification = await notificationFactory.makePrismaNotification({
      recipientId: newUser.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${newNotification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        notificationId: newNotification.id.toString(),
      }),
    )

    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        recipientId: newUser.id.toString(),
        id: newNotification.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).toBeTruthy()
  })
})
