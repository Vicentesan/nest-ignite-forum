import { Answer as PrismaAnswer, User as PrismaUser } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'

type PrismaAnswerWithAuthor = PrismaAnswer & {
  author: {
    id: PrismaUser['id']
    name: PrismaUser['name']
  }
}

export class PrismaAnswerWithAuthorMapper {
  static toDomain(raw: PrismaAnswerWithAuthor): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityId(raw.id),
      content: raw.content,
      authorId: new UniqueEntityId(raw.authorId),
      authorName: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
