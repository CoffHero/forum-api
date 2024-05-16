const NewCommentLike = require('../../../Domains/likes/entities/NewCommentLike')
const AddedCommentLike = require('../../../Domains/likes/entities/AddedCommentLike')
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddAndDeleteCommentLikeUseCase = require('../AddAndDeleteCommentLikeUseCase')

describe('AddCommentLikeUseCase', () => {
  it('should orchestrating the delete commentLike action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkingCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.checkingCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(1))
    mockCommentLikeRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(1))

    const deleteCommentLikeUseCase = new AddAndDeleteCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // Action
    await deleteCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkingThreadById)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkingCommentById)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentLikeRepository.checkingCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner)
    expect(mockCommentLikeRepository.deleteCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner)
  })

  it('should orchestrating the new comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'dicoding'
    }

    const mockAddedCommentLike = new AddedCommentLike({
      id: 'commentLike-123',
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkingCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.checkingCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedCommentLike))

    const addCommentLikeUseCase = new AddAndDeleteCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // Action
    const addedCommentLike = await addCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(addedCommentLike).toStrictEqual(new AddedCommentLike({
      id: 'commentLike-123',
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner
    }))
    expect(mockThreadRepository.checkingThreadById)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkingCommentById)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentLikeRepository.checkingCommentLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner)
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(new NewCommentLike({
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner
    }))
  })
})
