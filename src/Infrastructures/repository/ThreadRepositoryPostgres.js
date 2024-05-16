const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkingThreadById (threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Thread Tidak Ditemukan')
    }
  }

  async addThread (newThread) {
    const { title, body, owner } = newThread
    const id = `thread-${this._idGenerator()}`
    const time = new Date()

    const query = {
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, time]
    }
    const result = await this._pool.query(query)

    return new AddedThread({ ...result.rows[0] })
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
            FROM threads 
            LEFT JOIN users ON (threads.owner = users.id) 
            WHERE threads.id = $1`,
      values: [threadId]
    }
    const result = await this._pool.query(query)

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
