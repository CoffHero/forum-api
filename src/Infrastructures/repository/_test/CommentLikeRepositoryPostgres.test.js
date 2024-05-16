const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres')
const AddedCommentLike = require('../../../Domains/likes/entities/AddedCommentLike')
const NewCommentLike = require('../../../Domains/likes/entities/NewCommentLike')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await CommentLikeTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('checkingCommentLike function', () => {
    it('checking comment is liked', async () => {
      // arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool)
      const commentLikePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      }
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await CommentLikeTableTestHelper.addCommentLike({ id: 'commentLike-123', commentId: 'comment-123', owner: 'user-123' })
      // action
      const like = await commentLikeRepositoryPostgres.checkingCommentLike(commentLikePayload.commentId, commentLikePayload.owner)

      // assert
      expect(like).toBeTruthy()
    })

    it('should return false when comment not like', async () => {
      // arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool)

      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await CommentLikeTableTestHelper.addCommentLike({ id: 'commentLike-123', commentId: 'comment-123', owner: 'user-123' })
      // action
      const like = await commentLikeRepositoryPostgres.checkingCommentLike({ commentId: 'comment-123', owner: 'user-123' })

      // assert
      expect(like).toBeFalsy()
    })
  })

  describe('addCommentLike function', () => {
    it('should add like to comment', async () => {
      // arrange
      const newCommentLikepayload = new NewCommentLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123'
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator)

      // action
      const addedCommentLike = await commentLikeRepositoryPostgres.addCommentLike(newCommentLikepayload)
      // assert
      expect(addedCommentLike).toStrictEqual(new AddedCommentLike({
        id: `commentLike-${fakeIdGenerator()}`,
        owner: addedCommentLike.owner
      }))
    })
  })

  describe('getCommentIdFromCommentLike function', () => {
    it('should return how many comment like', async () => {
      // arrange
      const getCommentLikePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      }

      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'dicoding2' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await CommentLikeTableTestHelper.addCommentLike({ id: 'commentLike-123', commentId: 'comment-123', owner: 'user-123' })
      await CommentLikeTableTestHelper.addCommentLike({ id: 'commentLike-234', commentId: 'comment-123', owner: 'user-234' })
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool)

      // action
      const likeCount = await commentLikeRepositoryPostgres.getCommentIdFromCommentLike(getCommentLikePayload.threadId)

      // assert
      expect(likeCount).toStrictEqual([{ id_comment: 'comment-123' }, { id_comment: 'comment-123' }])
    })
  })

  describe('deleteCommentLike function', () => {
    it('should delete comment like', async () => {
      // arrange
      const deleteCommentLikePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123'
      }
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await CommentLikeTableTestHelper.addCommentLike({ id: 'commentLike-123', commentId: 'comment-123', owner: 'user-123' })
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool)

      // action
      const like = await commentLikeRepositoryPostgres.deleteCommentLike(deleteCommentLikePayload.commentId, deleteCommentLikePayload.owner)

      // assert
      expect(like).toBeTruthy()
    })
  })
})
