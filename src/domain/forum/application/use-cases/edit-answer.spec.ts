import { MakeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = MakeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)
    inMemoryAnswerAttachmentsRepository.items.push(
      MakeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: newAnswer.id,
      }),
      MakeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: newAnswer.id,
      }),
    )

    const result = await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: 'new content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content',
    })
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ],
    )
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = MakeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'diff-author',
      content: 'new content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
