const NewReply = require('../NewReply')

describe('new Reply entities', () => {
  it('should throw error when did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'ini reply'
    }

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: {},
      commentId: 123,
      content: true,
      owner: 'owner-123'
    }

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create newReply object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'ini reply',
      owner: 'user-123'
    }

    const { threadId, commentId, content, owner } = new NewReply(payload)

    expect(threadId).toEqual(payload.threadId)
    expect(commentId).toEqual(payload.commentId)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
