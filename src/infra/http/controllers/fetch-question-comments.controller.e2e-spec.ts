import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

let app: INestApplication
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let questionCommentFactory: QuestionCommentFactory

describe('Fetch Question Comment (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    await Promise.all([
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Comment 01',
      }),
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Comment 02',
      }),
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Comment 03',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${newQuestion.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        questionComments: [
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
