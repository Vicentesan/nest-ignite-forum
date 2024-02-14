import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'

let app: INestApplication
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory
let answerFactory: AnswerFactory

describe('Fetch Question Answer (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    await Promise.all([
      await answerFactory.makePrismaAnswer({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Answer 01',
      }),
      await answerFactory.makePrismaAnswer({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Answer 02',
      }),
      await answerFactory.makePrismaAnswer({
        authorId: newUser.id,
        questionId: newQuestion.id,
        content: 'Answer 03',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/${newQuestion.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        answers: [
          expect.objectContaining({ content: 'Answer 03' }),
          expect.objectContaining({ content: 'Answer 02' }),
          expect.objectContaining({ content: 'Answer 01' }),
        ],
      }),
    )
  })
})
