const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddReplyUseCase = require('../AddReplyUseCase')

describe('AddedReplyUseCase', () => {
  it('should orchestrating the new reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'ini reply 2',
      owner: 'dicoding'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkingCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload)

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    }))
    expect(mockThreadRepository.checkingThreadById)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkingCommentById)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      content: useCasePayload.content,
      owner: useCasePayload.owner
    }))
  })
})
