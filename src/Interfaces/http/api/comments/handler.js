const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentHandler {
  constructor (container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }

  async postCommentHandler (request, h) {
    const { id: owner } = request.auth.credentials
    const { content } = request.payload
    const { threadId } = request.params
    const newCommentPayload = {
      threadId,
      content,
      owner
    }

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const addedComment = await addCommentUseCase.execute(newCommentPayload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params

    const deleteCommentPayload = {
      threadId,
      commentId,
      owner
    }

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    await deleteCommentUseCase.execute(deleteCommentPayload)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = CommentHandler
