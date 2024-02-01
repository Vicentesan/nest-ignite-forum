import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer answer comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )

    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )

    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
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
