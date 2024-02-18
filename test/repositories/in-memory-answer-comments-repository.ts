import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async findById(answerCommentId: string) {
    const answer = this.items.find(
      (item) => item.id.toString() === answerCommentId,
    )

    if (!answer) return null

    return answer
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author)
          throw new Error(
            `Author with id "${comment.authorId.toString()}" does not exist.`,
          )

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          authorName: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return answerComments
  }
}
