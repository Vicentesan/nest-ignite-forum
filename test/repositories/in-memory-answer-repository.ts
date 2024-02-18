import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )
    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answer = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answer
  }

  async findById(answerId: string) {
    const answer = this.items.find((item) => item.id.toString() === answerId)

    if (!answer) return null

    return answer
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(answer.authorId),
        )

        if (!author)
          throw new Error(
            `Author with id "${answer.authorId.toString()}" does not exist.`,
          )

        return AnswerWithAuthor.create({
          answerId: answer.id,
          content: answer.content,
          authorId: answer.authorId,
          authorName: author.name,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      })

    return answerComments
  }
}
