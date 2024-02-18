import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

type PrismaCommentWithAuthor = PrismaComment & {
  author: {
    id: PrismaUser['id']
    name: PrismaUser['name']
  }
}

export class PrismaQuestionCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    if (!raw.questionId) throw new Error('Invalid comment type')

    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      content: raw.content,
      authorId: new UniqueEntityId(raw.authorId),
      authorName: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
