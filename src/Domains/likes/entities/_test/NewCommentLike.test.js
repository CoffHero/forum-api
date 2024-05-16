const NewCommentLike = require('../NewCommentLike')

describe('new Comment Like entities', () => {
  it('should throw error when did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    expect(() => new NewCommentLike(payload)).toThrowError('NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: {},
      commentId: 123,
      owner: 'owner-123'
    }

    expect(() => new NewCommentLike(payload)).toThrowError('NEW_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create newCommentLike object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const { threadId, commentId, owner } = new NewCommentLike(payload)

    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(owner).toEqual(payload.owner)
  })
})
