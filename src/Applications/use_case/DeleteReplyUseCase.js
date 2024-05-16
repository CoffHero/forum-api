const DeleteReply = require('../../Domains/replies/entities/DeleteReply')

class DeleteReplyUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload) {
    const replyPayload = new DeleteReply(useCasePayload)
    await this._threadRepository.checkingThreadById(replyPayload.threadId)
    await this._commentRepository.checkingCommentById(replyPayload.commentId)
    await this._replyRepository.checkingReplyById(replyPayload.replyId)
    await this._replyRepository.verifyReplyByOwner(replyPayload.replyId, replyPayload.owner)
    return this._replyRepository.deleteReply(replyPayload.replyId)
  }
}

module.exports = DeleteReplyUseCase
