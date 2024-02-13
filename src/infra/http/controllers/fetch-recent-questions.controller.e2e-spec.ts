import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'

let app: INestApplication
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory

describe('Fetch Recent Questions Controller (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    await Promise.all([
      await questionFactory.makePrismaQuestion({
        authorId: newUser.id,
        title: 'Question 01',
      }),
      await questionFactory.makePrismaQuestion({
        authorId: newUser.id,
        title: 'Question 02',
      }),
      await questionFactory.makePrismaQuestion({
        authorId: newUser.id,
        title: 'Question 03',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        questions: [
          expect.objectContaining({ title: 'Question 03' }),
          expect.objectContaining({ title: 'Question 02' }),
          expect.objectContaining({ title: 'Question 01' }),
        ],
      }),
    )
  })
})
