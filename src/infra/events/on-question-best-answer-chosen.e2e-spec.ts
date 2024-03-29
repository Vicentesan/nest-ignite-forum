import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerFactory } from 'test/factories/make-answer'

import request from 'supertest'
import { waitFor } from 'test/utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let answerFactory: AnswerFactory

describe('On Question Best Answer Chosen (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('it should send a notification when an answer is chosen as the best', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const newAnswser = await answerFactory.makePrismaAnswer({
      authorId: newUser.id,
      questionId: newQuestion.id,
    })

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    await request(app.getHttpServer())
      .patch(`/answers/${newAnswser.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: newUser.id.toString(),
        },
      })

      expect(notificationOnDatabase).toBeTruthy()
    })
  })
})
