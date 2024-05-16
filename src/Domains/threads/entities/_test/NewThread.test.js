const NewThread = require('../NewThread')

describe('new Thread entities', () => {
  it('should throw error when did not contain needed property', () => {
    const payload = {
      title: 'abc',
      body: 'halo semua'
    }

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'halo',
      owner: 'owner-123'
    }

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create registerUser object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'halo semua',
      owner: 'user-123'
    }

    const { title, body, owner } = new NewThread(payload)

    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
    expect(owner).toEqual(payload.owner)
  })
})
