const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()

    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkingCommentById (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND del = false',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Komentar Tidak Ditemukan')
    }
  }

  async verifyCommentByOwner (commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId]
    }
    const result = await this._pool.query(query)

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda Tidak Berhak Mengakses Komentar Ini')
    }
  }

  async addComment (newComment) {
    const { threadId, content, owner } = newComment
    const id = `comment-${this._idGenerator()}`
    const time = new Date()

    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, threadId, content, owner, time]
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async getCommentsByThreadId (threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.del
              FROM comments 
              LEFT JOIN users ON (comments.owner = users.id)
              WHERE comments.id_thread = $1
              ORDER BY comments.date ASC`,
      values: [threadId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteComment (commentId) {
    const query = {
      text: 'UPDATE comments SET del = true WHERE id = $1',
      values: [commentId]
    }
    await this._pool.query(query)
  }
}

module.exports = CommentRepositoryPostgres
