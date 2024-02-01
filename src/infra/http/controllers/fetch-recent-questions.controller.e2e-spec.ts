import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService

describe('Fetch Recent Questions Controller (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const newUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'Johndoe@example.com',
        password_hash: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: newUser.id })

    await prisma.question.createMany({
      data: [
        {
          authorId: newUser.id,
          slug: 'question-01',
          title: 'Question 01',
          content: 'Question 01 Cotent',
        },
        {
          authorId: newUser.id,
          slug: 'question-02',
          title: 'Question 02',
          content: 'Question 02 Cotent',
        },
        {
          authorId: newUser.id,
          slug: 'question-03',
          title: 'Question 03',
          content: 'Question 03 Cotent',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
        expect.objectContaining({ title: 'Question 03' }),
      ],
    })
  })
})
