const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const DeleteReplyUseCase = require('../DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkingCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.checkingReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyReplyByOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    await deleteReplyUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkingThreadById)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkingCommentById)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockReplyRepository.checkingReplyById)
      .toBeCalledWith(useCasePayload.replyId)
    expect(mockReplyRepository.verifyReplyByOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner)
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCasePayload.replyId)
  })
})
