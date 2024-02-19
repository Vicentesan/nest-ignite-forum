import { MakeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { MakeStudent } from 'test/factories/make-student'
import { MakeAttachment } from 'test/factories/make-attachment'
import { MakeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = MakeStudent()

    inMemoryStudentsRepository.items.push(student)

    const newQuestion = MakeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const attachment = MakeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment)
    inMemoryQuestionAttachmentsRepository.items.push(
      MakeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(
      expect.objectContaining({
        question: expect.objectContaining({
          title: newQuestion.title,
          authorName: student.name,
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: attachment.title,
            }),
          ]),
        }),
        success: true,
      }),
    )
  })
})
