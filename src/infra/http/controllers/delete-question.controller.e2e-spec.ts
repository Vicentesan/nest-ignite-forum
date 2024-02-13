import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService
let studentFactory: StudentFactory
let questionFactory: QuestionFactory

describe('Delete Question (e2e)', () => {
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

    await app.init()
  })

  test('[DELETE] /questions/:id', async () => {
    const newUser = await studentFactory.makePrismaStudent()

    const newQuestion = await questionFactory.makePrismaQuestion({
      authorId: newUser.id,
    })

    const accessToken = jwt.sign({ sub: newUser.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${newQuestion.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        slug: newQuestion.slug.value,
      },
    })

    expect(questionOnDatabase).toBeNull()
  })
})
