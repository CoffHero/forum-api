const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const CommentLikeTableTestHelper = require('../../../../tests/CommentLikeTableTestHelper')

describe('endpoints to manage likes', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await CommentLikeTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when add like without authentications', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.generateAccessToken(server)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Thread Tidak Ditemukan')
    })

    it('should response 404 when comment not found', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)
      const { accessToken, owner } = await ServerTestHelper.generateAccessToken(server)
      await ThreadTableTestHelper.addThread({ id: threadId, owner })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Komentar Tidak Ditemukan'
      )
    })

    it('should response 200 when add comment like ', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)
      const { accessToken, owner } = await ServerTestHelper.generateAccessToken(server)
      await ThreadTableTestHelper.addThread({ id: threadId, owner })
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
