import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'
import { MakeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer answer comments', async () => {
    const student = MakeStudent()

    inMemoryStudentsRepository.items.push(student)

    const answer1 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const answer2 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    const answer3 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(answer1)
    await inMemoryAnswerCommentRepository.create(answer2)
    await inMemoryAnswerCommentRepository.create(answer3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
    expect(result.value?.answerComments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: answer1.id,
          authorName: student.name,
        }),
        expect.objectContaining({
          commentId: answer2.id,
          authorName: student.name,
        }),
        expect.objectContaining({
          commentId: answer3.id,
          authorName: student.name,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer answer comments', async () => {
    const student = MakeStudent()

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
