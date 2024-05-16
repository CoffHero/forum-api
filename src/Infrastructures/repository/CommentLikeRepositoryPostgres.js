const CommentLikeRepository = require('../../Domains/likes/CommentLikeRepository')
const AddedCommentLike = require('../../Domains/likes/entities/AddedCommentLike')

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor (pool, idGenerator) {
    super()

    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkingCommentLike (commentId, owner) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE  id_comment = $1 AND owner = $2',
      values: [commentId, owner]
    }
    const result = await this._pool.query(query)

    return result.rowCount
  }

  async addCommentLike (newCommentLike) {
    const { commentId, owner } = newCommentLike
    const id = `commentLike-${this._idGenerator()}`
    const time = new Date()

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1,$2,$3,$4) RETURNING id, id_comment, owner',
      values: [id, commentId, owner, time]
    }
    const result = await this._pool.query(query)
    return new AddedCommentLike({ ...result.rows[0] })
  }

  async getCommentIdFromCommentLike (threadId) {
    const query = {
      text: `SELECT id_comment FROM comment_likes
            WHERE EXISTS (
            SELECT 1 FROM comments
            WHERE id = comment_likes.id_comment AND id_thread = $1)`,
      values: [threadId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteCommentLike (commentId, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE id_comment = $1 AND owner = $2',
      values: [commentId, owner]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = CommentLikeRepositoryPostgres
