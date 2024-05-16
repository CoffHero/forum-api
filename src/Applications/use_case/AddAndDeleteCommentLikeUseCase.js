const NewCommentLike = require('../../Domains/likes/entities/NewCommentLike')

class AddAndDeleteCommentLikeUseCase {
  constructor ({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._commentLikeRepository = commentLikeRepository
  }

  async execute (useCasePayload) {
    const newCommentLike = new NewCommentLike(useCasePayload)
    await this._threadRepository.checkingThreadById(newCommentLike.threadId)
    await this._commentRepository.checkingCommentById(newCommentLike.commentId)
    const like = await this._commentLikeRepository.checkingCommentLike(newCommentLike.commentId, newCommentLike.owner)

    if (like >= 1) {
      return this._commentLikeRepository.deleteCommentLike(newCommentLike.commentId, newCommentLike.owner)
    }

    return this._commentLikeRepository.addCommentLike(newCommentLike)
  }
}

module.exports = AddAndDeleteCommentLikeUseCase
