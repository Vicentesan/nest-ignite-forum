import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'

import request from 'supertest'
import { waitFor } from 'test/utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory

describe('On Answer Created (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when a answer is created', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    await request(app.getHttpServer())
      .post(`/questions/${newQuestion.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Answer Content',
        attachments: [],
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: newUser.id.toString(),
        },
      })

      expect(notificationOnDatabase).toBeTruthy()
    })
  })
})
