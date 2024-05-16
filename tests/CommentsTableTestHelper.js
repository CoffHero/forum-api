/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentTableTestHelper = {
  async addComment ({
    id = 'comment-123', threadId = 'thread-123', content = 'sebuah comment', owner = 'user-123', time = new Date()
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, content, owner, time]
    }

    await pool.query(query)
  },

  async getCommentById (commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentTableTestHelper
