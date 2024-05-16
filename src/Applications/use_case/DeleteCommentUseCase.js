const DeleteComment = require('../../Domains/comments/entities/DeleteComment')

class DeleteCommentUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const commentPayload = new DeleteComment(useCasePayload)
    await this._threadRepository.checkingThreadById(commentPayload.threadId)
    await this._commentRepository.checkingCommentById(commentPayload.commentId)
    await this._commentRepository.verifyCommentByOwner(commentPayload.commentId, commentPayload.owner)
    return this._commentRepository.deleteComment(commentPayload.commentId)
  }
}

module.exports = DeleteCommentUseCase
