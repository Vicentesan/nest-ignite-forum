import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: {
    id: PrismaUser['id']
    name: PrismaUser['name']
  }
  attachments: {
    id: PrismaAttachment['id']
    title: PrismaAttachment['title']
    url: PrismaAttachment['url']
    questionId: PrismaAttachment['questionId']
  }[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      title: raw.title,
      slug: Slug.create(raw.slug),
      content: raw.content,
      attachments: raw.attachments.map((attachment) =>
        PrismaAttachmentMapper.toDomain({
          ...attachment,
          answerId: null, // Add a default value for the missing property
        }),
      ),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      authorId: new UniqueEntityId(raw.authorId),
      authorName: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
