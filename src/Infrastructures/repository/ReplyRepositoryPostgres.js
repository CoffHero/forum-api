const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const AddedReply = require('../../Domains/replies/entities/AddedReply')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkingReplyById (replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 and del = false',
      values: [replyId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Balasan Tidak Ditemukan')
    }
  }

  async verifyReplyByOwner (replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId]
    }

    const result = await this._pool.query(query)

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda Tidak Berhak Mengakses Komentar Ini')
    }
  }

  async addReply (newReply) {
    const { commentId, content, owner } = newReply
    const id = `reply-${this._idGenerator()}`
    const time = new Date()

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, time]
    }

    const result = await this._pool.query(query)

    return new AddedReply({ ...result.rows[0] })
  }

  async getRepliesByThreadId (threadId) {
    const query = {
      text: `SELECT replies.id, users.username, replies.date, replies.content, replies.id_comment, replies.del
              FROM replies 
              LEFT JOIN users ON (replies.owner = users.id)
              LEFT JOIN comments ON (replies.id_comment = comments.id)
              WHERE comments.id_thread = $1
              ORDER BY replies.date ASC`,
      values: [threadId]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteReply (replyId) {
    const query = {
      text: 'UPDATE replies SET del = true WHERE id = $1',
      values: [replyId]
    }

    await this._pool.query(query)
  }
}

module.exports = ReplyRepositoryPostgres
