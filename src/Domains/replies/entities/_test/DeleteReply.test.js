const DeleteReply = require('../DeleteReply')

describe('delete Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      repltId: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      replyId: {},
      threadId: 123,
      commentId: true,
      owner: 'owner-123'
    }

    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create deleteReply object correctly', () => {
    const payload = {
      replyId: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const { replyId, threadId, commentId, owner } = new DeleteReply(payload)

    expect(replyId).toEqual(payload.replyId)
    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(owner).toEqual(payload.owner)
  })
})
