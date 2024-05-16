const NewComment = require('../NewComment')

describe('new Comment entities', () => {
  it('should throw error when did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'ini comment'
    }

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 123,
      content: true,
      owner: 'owner-123'
    }

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create newComment object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'ini comment',
      owner: 'user-123'
    }

    const { threadId, content, owner } = new NewComment(payload)

    expect(threadId).toEqual(payload.threadId)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
