import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachments } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachments> {
  compareItems(a: AnswerAttachments, b: AnswerAttachments): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
