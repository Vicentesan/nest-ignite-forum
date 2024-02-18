import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { AnswerFactory } from 'test/factories/make-answer'

let app: INestApplication
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let answerFactory: AnswerFactory
let answerCommentFactory: AnswerCommentFactory

describe('Fetch Answer Comments (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerCommentFactory,
        AnswerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const newAnswer = await answerFactory.makePrismaAnswer({
      authorId: newUser.id,
      questionId: newQuestion.id,
    })

    await Promise.all([
      await answerCommentFactory.makePrismaAnswer({
        authorId: newUser.id,
        answerId: newAnswer.id,
        content: 'Comment 01',
      }),
      await answerCommentFactory.makePrismaAnswer({
        authorId: newUser.id,
        answerId: newAnswer.id,
        content: 'Comment 02',
      }),
      await answerCommentFactory.makePrismaAnswer({
        authorId: newUser.id,
        answerId: newAnswer.id,
        content: 'Comment 03',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${newAnswer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        answerComments: [
          expect.objectContaining({
            content: 'Comment 03',
            authorName: newUser.name,
          }),
          expect.objectContaining({
            content: 'Comment 02',
            authorName: newUser.name,
          }),
          expect.objectContaining({
            content: 'Comment 01',
            authorName: newUser.name,
          }),
        ],
      }),
    )
  })
})
