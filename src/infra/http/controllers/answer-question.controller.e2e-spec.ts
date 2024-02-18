import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let attachmentFacotry: AttachmentFactory

describe('Answer Question (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFacotry = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const attachment1 = await attachmentFacotry.makePrismaAttachment()
    const attachment2 = await attachmentFacotry.makePrismaAttachment()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/questions/${newQuestion.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Answer Content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Answer Content',
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
