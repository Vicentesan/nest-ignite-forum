import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch question question comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )

    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )

    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
