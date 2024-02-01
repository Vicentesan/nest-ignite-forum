import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

let app: INestApplication
let prisma: PrismaService
let jwt: JwtService

describe('Create Question Controller (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const newUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'Johndoe@example.com',
        password_hash: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: newUser.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Question title',
        content: 'Question Cotent',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        slug: 'question-title',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
