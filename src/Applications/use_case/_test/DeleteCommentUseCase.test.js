const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkingCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    await deleteCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkingThreadById)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkingCommentById)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentRepository.verifyCommentByOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner)
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.commentId)
  })
})
