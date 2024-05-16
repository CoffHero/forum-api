const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const GetThreadUseCase = require('../GetThreadUseCase')
const CommentLikesRepository = require('../../../Domains/likes/CommentLikeRepository')

describe('DetailThreadUseCase', () => {
  it('should get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'halo semua',
      date: '2024-05-07T05:48:24.301Z',
      username: 'dicoding'
    }

    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding1',
        date: '2024-05-07T05:50:15.640Z',
        content: 'ini comment 1',
        del: true
      },
      {
        id: 'comment-234',
        username: 'dicoding2',
        date: '2024-05-07T05:50:15.640Z',
        content: 'ini comment 2',
        del: false
      },
      {
        id: 'comment-345',
        username: 'dicoding3',
        date: '2024-05-07T05:50:15.640Z',
        content: 'ini comment 3',
        del: false
      }
    ]

    const mockReplies = [
      {
        id: 'reply-123',
        content: 'ini reply 1',
        date: '2024-05-07T05:52:35.170Z',
        username: 'dicoding1',
        id_comment: 'comment-123',
        del: true
      },
      {
        id: 'reply-234',
        content: 'ini reply 2',
        date: '2024-05-07T05:52:35.170Z',
        username: 'dicoding2',
        id_comment: 'comment-234',
        del: false
      }
    ]

    const mockCommentlikes = [
      {
        id_comment: 'comment-123'
      },
      {
        id_comment: 'comment-123'
      }
    ]

    const expectedDetailThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'halo semua',
      date: '2024-05-07T05:48:24.301Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding1',
          date: '2024-05-07T05:50:15.640Z',
          content: '**komentar telah dihapus**',
          likeCount: 2,
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '2024-05-07T05:52:35.170Z',
              username: 'dicoding1'
            }
          ]
        },
        {
          id: 'comment-234',
          username: 'dicoding2',
          date: '2024-05-07T05:50:15.640Z',
          content: 'ini comment 2',
          likeCount: 0,
          replies: [
            {
              id: 'reply-234',
              content: 'ini reply 2',
              date: '2024-05-07T05:52:35.170Z',
              username: 'dicoding2'
            }
          ]
        },
        {
          id: 'comment-345',
          username: 'dicoding3',
          date: '2024-05-07T05:50:15.640Z',
          content: 'ini comment 3',
          likeCount: 0,
          replies: []
        }
      ]
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockCommentLikeRepository = new CommentLikesRepository()

    mockThreadRepository.checkingThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments))
    mockCommentLikeRepository.getCommentIdFromCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentlikes))
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies))

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // Action
    const detailedThread = await getThreadUseCase.execute(threadId)

    // Assert
    expect(detailedThread).toStrictEqual(expectedDetailThread)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId)
    expect(mockCommentLikeRepository.getCommentIdFromCommentLike).toBeCalledWith(threadId)
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId)
  })
})
