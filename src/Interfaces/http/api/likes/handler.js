const AddAndDeleteCommentLikeUseCase = require('../../../../Applications/use_case/AddAndDeleteCommentLikeUseCase')

class CommentLikesHandler {
  constructor (container) {
    this._container = container

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this)
  }

  async putCommentLikeHandler (request, h) {
    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params
    const newCommentLikePayload = {
      threadId,
      commentId,
      owner
    }

    const addAndDeleteCommentLikeUseCase = this._container.getInstance(AddAndDeleteCommentLikeUseCase.name)
    await addAndDeleteCommentLikeUseCase.execute(newCommentLikePayload)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = CommentLikesHandler
