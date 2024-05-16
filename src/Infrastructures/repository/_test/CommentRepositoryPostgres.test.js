const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('chenckingCommentById function', () => {
    it('should throw NotFoundError if comment not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action & Assert
      await expect(commentRepositoryPostgres.checkingCommentById('comment-234'))
        .rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError if comment exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })

      // Action & Assert
      await expect(commentRepositoryPostgres.checkingCommentById('comment-123'))
        .resolves.not.toThrow(NotFoundError)
    })
  })

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      const addComment = new NewComment({
        threadId: 'thread-123',
        content: 'ini comment',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment)

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById(addedComment.id)
      expect(comment).toHaveLength(1)
      expect(addedComment).toStrictEqual(new AddedComment({
        id: `comment-${fakeIdGenerator()}`,
        content: addComment.content,
        owner: addComment.owner
      }))
    })
  })

  describe('checkingByOwner function', () => {
    it('should throw AuthorizationError if owner is not valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwner('comment-123', 'user-234'))
        .rejects.toThrow(AuthorizationError)
    })

    it('should not throw AuthorizationError if owner is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentByOwner('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError)
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should get comments by threadId correctly', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      const userPayload = {
        id: 'user-123',
        username: 'dicoding'
      }
      await UsersTableTestHelper.addUser(userPayload)
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userPayload.id })
      const commentPayload = {
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'ini comment',
        owner: userPayload.id
      }
      await CommentsTableTestHelper.addComment(commentPayload)

      // Action
      const commentsResult = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(commentsResult).toBeDefined()
      expect(commentsResult).toHaveLength(1)
      expect(commentsResult[0].id).toEqual(commentPayload.id)
      expect(commentsResult[0].content).toEqual(commentPayload.content)
      expect(commentsResult[0].username).toEqual(userPayload.username)
      expect(commentsResult[0].del).toEqual(false)
    })

    it('should get empty array when comments by threadId is empty', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })

      // Action
      const commentsResult = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(commentsResult).toBeDefined()
      expect(commentsResult).toHaveLength(0)
    })
  })

  describe('deleteComment function', () => {
    it('should return delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool)

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123')

      // Assert
      const commentResult = await CommentsTableTestHelper.getCommentById('comment-123')
      expect(commentResult).toBeDefined()
      expect(commentResult).toHaveLength(1)
      expect(commentResult[0].del).toEqual(true)
    })
  })
})
