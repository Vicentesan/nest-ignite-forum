import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'

import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'

let app: INestApplication
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory

describe('Get Question By Slug (e2e)', () => {
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

  test('[GET] /questions/:slug', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    questionFactory.makePrismaQuestion({
      authorId: newUser.id,
      slug: Slug.create('question-01'),
      title: 'Question 01',
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        question: expect.objectContaining({ title: 'Question 01' }),
      }),
    )
  })
})
