import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { MakeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = MakeStudent({
      email: 'Johndoe@example.com',
      password_hash: await fakeHasher.hash('123456'),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'Johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })
})
