import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let fakeHasher: FakeHasher
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        student: inMemoryStudentsRepository.items[0],
      }),
    )
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'Johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password_hash).toEqual(
      hashedPassword,
    )
  })
})
