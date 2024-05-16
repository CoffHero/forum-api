const DeleteComment = require('../DeleteComment')

describe('delete Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 123,
      commentId: true,
      owner: 'owner-123'
    }

    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create deleteComment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const { threadId, commentId, owner } = new DeleteComment(payload)

    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(owner).toEqual(payload.owner)
  })
})
