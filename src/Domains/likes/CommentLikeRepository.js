class CommentLikesRepository {
  async checkingCommentLike (commentId, owner) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addCommentLike (newCommentLike) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentIdFromCommentLike (threadId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteCommentLike (commentLikeId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentLikesRepository
