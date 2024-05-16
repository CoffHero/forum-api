const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end
  })

  describe('checkingThreadById function', () => {
    it('should throw NotFoundError if thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)

      // Action & Assert
      await expect(threadRepositoryPostgres.checkingThreadById('thread-234'))
        .rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError if thread exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)
      await UsersTableTestHelper.addUser({ id: 'user-234' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-234', owner: 'user-234' })

      // Action & Assert
      await expect(threadRepositoryPostgres.checkingThreadById('thread-234'))
        .resolves.not.toThrow(NotFoundError)
    })
  })

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'halo semua',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123'

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'halo semua',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123'

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123'
      }))
    })
  })

  describe('getThreadById function', () => {
    it('should get detail thread correctly', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {})
      const userPayload = { id: 'user-123', username: 'dicoding123' }
      const threadPayload = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'halo semua',
        owner: userPayload.id
      }
      await UsersTableTestHelper.addUser(userPayload)
      await ThreadsTableTestHelper.addThread(threadPayload)

      // Action
      const threadResult = await threadRepository.getThreadById(threadPayload.id)

      // Assert
      expect(threadResult).toBeDefined()
      expect(threadResult.id).toEqual(threadPayload.id)
      expect(threadResult.title).toEqual(threadPayload.title)
      expect(threadResult.body).toEqual(threadPayload.body)
      expect(threadResult.username).toEqual(userPayload.username)
    })
  })
})
