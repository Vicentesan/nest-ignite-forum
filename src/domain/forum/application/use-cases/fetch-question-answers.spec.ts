import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answers'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { MakeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionsAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const student = MakeStudent()

    inMemoryStudentsRepository.items.push(student)

    const answer1 = MakeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const answer2 = MakeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    const answer3 = MakeAnswer({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await inMemoryAnswersRepository.create(answer1)
    await inMemoryAnswersRepository.create(answer2)
    await inMemoryAnswersRepository.create(answer3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ answerId: answer1.id, authorId: student.id }),
        expect.objectContaining({ answerId: answer2.id, authorId: student.id }),
        expect.objectContaining({ answerId: answer3.id, authorId: student.id }),
      ]),
    )
  })

  it('should be able to fetch paginated question answers', async () => {
    const student = MakeStudent()

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        MakeAnswer({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
