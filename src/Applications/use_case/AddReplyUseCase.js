const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload) {
    const newReply = new NewReply(useCasePayload)
    await this._threadRepository.checkingThreadById(newReply.threadId)
    await this._commentRepository.checkingCommentById(newReply.commentId)
    return this._replyRepository.addReply(newReply)
  }
}

module.exports = AddReplyUseCase
