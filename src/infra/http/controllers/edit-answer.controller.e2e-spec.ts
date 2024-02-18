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
import { AttachmentFactory } from 'test/factories/make-attachment'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let answerFactory: AnswerFactory
let attachmentFacotry: AttachmentFactory
let answernAttachmentFactory: AnswerAttachmentFactory

describe('Edit Answer (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFacotry = moduleRef.get(AttachmentFactory)
    answernAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const attachment1 = await attachmentFacotry.makePrismaAttachment()
    const attachment2 = await attachmentFacotry.makePrismaAttachment()

    const newAnswser = await answerFactory.makePrismaAnswer({
      authorId: newUser.id,
      questionId: newQuestion.id,
    })

    await answernAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment1.id,
      answerId: newAnswser.id,
    })

    await answernAttachmentFactory.makePrismaAnswerAttachment({
      attachmentId: attachment2.id,
      answerId: newAnswser.id,
    })

    const attachment3 = await attachmentFacotry.makePrismaAttachment()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/answers/${newAnswser.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New Answer Content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'New Answer Content',
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
  })
})
