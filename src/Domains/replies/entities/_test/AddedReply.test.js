const AddedReply = require('../AddedReply')

describe('added Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini reply'
    }

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: true,
      owner: 'owner-123'
    }

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'ini reply',
      owner: 'user-123'
    }

    const { id, content, owner } = new AddedReply(payload)

    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
