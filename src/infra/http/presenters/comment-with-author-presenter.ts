import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

export class CommentWithAuthorPresenter {
  static present(commentWithAutor: CommentWithAuthor) {
    return {
      commentId: commentWithAutor.commentId.toString(),
      content: commentWithAutor.content,
      authorId: commentWithAutor.authorId.toString(),
      authorName: commentWithAutor.authorName,
      createdAt: commentWithAutor.createdAt,
      updatedAt: commentWithAutor.updatedAt,
    }
  }
}
