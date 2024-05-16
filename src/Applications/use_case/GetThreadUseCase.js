class GetThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._commentLikeRepository = commentLikeRepository
  }

  async execute (threadId) {
    await this._threadRepository.checkingThreadById(threadId)
    const thread = await this._threadRepository.getThreadById(threadId)
    const comments = await this._commentRepository.getCommentsByThreadId(threadId)
    const replies = await this._replyRepository.getRepliesByThreadId(threadId)
    const likes = await this._commentLikeRepository.getCommentIdFromCommentLike(threadId)
    const commentDetails = await this._mappingCommentAndReplies(comments, replies, likes)
    return {
      ...thread,
      comments: commentDetails
    }
  }

  _mappingCommentAndReplies (comments, replies, likes) {
    return comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.del ? '**komentar telah dihapus**' : comment.content,
      likeCount: likes.filter((like) => like.id_comment === comment.id).length,
      replies: replies
        .filter((reply) => reply.id_comment === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.del ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username
        }))
    }))
  }
}

module.exports = GetThreadUseCase
