const AddedCommentLike = require('../AddedCommentLike')

describe('added Comment Like entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'commentLike-123'
    }

    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      owner: 'owner-123'
    }

    expect(() => new AddedCommentLike(payload)).toThrowError('ADDED_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'commentLike-123',
      owner: 'user-123'
    }

    const { id, owner } = new AddedCommentLike(payload)

    expect(id).toEqual(payload.id)
    expect(owner).toEqual(payload.owner)
  })
})
